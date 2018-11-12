<template>
  <div v-transfer-dom :data-transfer="transfer">
    <transition :name="transitionNames[1]">
      <div :class="maskClasses" v-show="visible" @click="mask" :style="stylecls"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick" :style="stylecls" ref="wrap">
      <transition :name="transitionNames[0]" @after-leave="animationFinish">
        <!-- <div :class="classes"> -->
          <div :class="[prefixCls + '-content']" v-show="visible" :style="mainStyles" ref="content">
            <a :class="[prefixCls + '-maximize']" v-if="maximize" @click="switchSize">
              <slot name="maximize">
                <Icon :name="maxName"></Icon>
              </slot>
            </a>
            <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
              <slot name="close">
                <Icon name="close"></Icon>
              </slot>
            </a>
            <div :class="[prefixCls + '-header']" v-if="showHead" v-drag="[this.canDrag,this.isBeyond]"><slot name="header"><div :class="[prefixCls + '-header-inner']">{{ title }}</div></slot></div>
            <div :class="[prefixCls + '-body']"  :style="contentStyle"><slot></slot></div>
            <div :class="[prefixCls + '-footer']" v-if="!footerHide">
              <slot name="footer">
                <h-button type="text" size="large" @click="cancel">{{ localeCancelText }}</h-button>
                <h-button type="primary" size="large" :loading="buttonLoading" @click="ok">{{ localeOkText }}</h-button>
              </slot>
            </div>
          </div>
        <!-- </div> -->
      </transition>
    </div>
  </div>
</template>
<script>
import Icon from '../Icon/Icon.vue';
import hButton from '../Button/Button.vue';
import TransferDom from '../../directives/transfer-dom';
import ScrollbarMixins from './mixins-scrollbar';
import Locale from '../../mixins/locale';
import Emitter from '../../mixins/emitter';
import Drag from '../../directives/drag.js';
import { on, off } from '../../util/dom';
const prefixCls = 'h-modal';

export default {
  name: 'Msgbox',
  mixins: [ Locale, Emitter, ScrollbarMixins],
  components: { Icon, hButton },
  directives: { TransferDom,Drag },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 520
    },
    okText: {
      type: String
    },
    cancelText: {
        type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object
    },
    className: {
      type: String
    },
    // for instance
    footerHide: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    transitionNames: {
      type: Array,
      default () {
        return ['ease', 'fade'];
      }
    },
    transfer: {
      type: Boolean,
      default: true
    },
    top: {
      top: [String,Number],
      default: 100
    },
    escClose: {
      type:Boolean,
      default:false
    },
    canDrag:{
      type:Boolean,
      default:true
    },
    zIndex:{
      type:Number,
      default:1000
    },
    isBeyond:{
      type:Boolean,
      default:false,
    },
    isOriginal:{
      type:Boolean,
      default:false,
    },
    height: [String,Number],
    maximize:{
      type:Boolean,
      default:false,
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      wrapShow: false,
      showHead: true,
      buttonLoading: false,
      visible: this.value,
      screenWidth:null,
      curWidth:this.width,
      curHeight:0,
      isMax:false,
    };
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}-wrap`,
        {
          [`${prefixCls}-hidden`]: !this.wrapShow,
          [`${this.className}`]: !!this.className
        }
      ];
    },
    maskClasses () {
      return `${prefixCls}-mask`;
    },
    classes () {
      return `${prefixCls}`;
    },
    mainStyles () {
      this.screenWidth = document.documentElement.clientWidth;
      let style = {};
      const width = parseInt(this.curWidth);
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`,
        height:this.curHeight?this.curHeight+'px':'auto'
      };
      style.top=this.curHeight?'0':this.top+'px';
      style.left = (this.screenWidth-width)/2+'px';
      const customStyle = this.styles ? this.styles : {};
      Object.assign(style, styleWidth, customStyle);
      return style;
    },
    localeOkText () {
      if (this.okText === undefined) {
        return this.t('i.modal.okText');
      } else {
        return this.okText;
      }
    },
    localeCancelText () {
      if (this.cancelText === undefined) {
        return this.t('i.modal.cancelText');
      } else {
        return this.cancelText;
      }
    },
    stylecls () {
      let style={};
      style.zIndex = this.zIndex;
      return style;
    },
    contentStyle () {
      let style = {}
      if (this.height) {
        style.height = this.height + 'px'
        style.overflowY = "auto"
      }
      return style
    },
    maxName () {
      return this.isMax?'max':'min'
    }
  },
  methods: {
    close () {
      this.$emit('input', false);
      this.$emit('on-close');
      this.visible = false;
    },
    switchSize(){
      if(!this.isMax){
        this.curWidth = this.screenWidth;
        this.curHeight = document.documentElement.clientHeight;
      }else{
        this.curWidth = this.width;
        this.curHeight = 0;
      }
      this.isMax = !this.isMax;
    },
    backOrigin(){      
      const obj = this.$refs.content;
      const width = parseInt(this.curWidth);
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      };
      if(Number(this.top)<=0) this.$refs.wrap.style.display="flex";
      obj.style.top=this.top+'px';
      obj.style.left = (this.screenWidth-width)/2+'px';
    },
    mask () {
      if (this.maskClosable) {
        this.close();
      }
    },
    handleWrapClick (event) {
      // use indexOf,do not use === ,because h-modal-wrap can have other custom className
      const className = event.target.getAttribute('class');
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.mask();
    },
    cancel () {
      this.$emit('on-cancel');
      this.visible = false;
      this.$emit('input', false);
    },
    ok () {
      if (this.loading) {
        this.buttonLoading = true;
      } else {
        this.visible = false;
        this.$emit('input', false);
      }
      this.$emit('on-ok');
    },
    EscClose (e) {
      if (this.visible && this.escClose) {
        if (e.keyCode === 27) {
          this.close();
        }
      }
    },
    animationFinish() {
      this.$emit('on-hidden');
    },
    ScreenRes() {
      this.screenWidth = document.documentElement.clientWidth;
    }
  },
  mounted () {
    if (this.visible) {
        this.wrapShow = true;
    }
    let showHead = true;

    if (this.$slots.header === undefined && !this.title) {
        showHead = false;
    }

    this.showHead = showHead;

    // ESC close
    // document.addEventListener('keydown', this.EscClose);
    on(document,'keydown', this.EscClose)
    on(window, 'resize', this.ScreenRes);
  },
  beforeDestroy () {
    off(document,'keydown',this.EscClose);
    off(window, 'resize', this.ScreenRes);
    this.removeScrollEffect();
  },
  watch: {
    value (val) {
      this.visible = val;
      if(val&&this.isOriginal) this.backOrigin();
    },
    visible (val) {
      if (val === false) {
          this.buttonLoading = false;
          this.timer = setTimeout(() => {
              this.wrapShow = false;
              this.removeScrollEffect();
          }, 300);
      } else {
          if (this.timer) clearTimeout(this.timer);
          this.wrapShow = true;
          if (!this.scrollable) {
              this.addScrollEffect();
          }
      }
      this.broadcast('Table', 'on-visible-change', val);
    },
    loading (val) {
      if (!val) {
          this.buttonLoading = false;
      }
    },
    scrollable (val) {
      if (!val) {
          this.addScrollEffect();
      } else {
          this.removeScrollEffect();
      }
    },
    title (val) {
      if (this.$slots.header === undefined) {
          this.showHead = !!val;
      }
    },
    width(val){
      this.curWidth = val;
    },
  }
};
</script>
