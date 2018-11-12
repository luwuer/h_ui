<template>
  <div :class="classes">
    <template v-if="panelAbove">
      <div :class="contentClasses" :style="contentStyle"><slot></slot></div>
      <!-- <div :class="[prefixCls + '-bar']"> -->
      <div :class="barTop">
        <div :class="[prefixCls + '-nav-container']">
          <div v-if="showArrow" :class="[prefixCls + '-return']" v-on:click = "leftClick($event)" >
            <Icon name="return"></Icon>
          </div>
          <div :class="navWrap"  style="float:left">
            <div :class="[prefixCls + '-nav-scroll']">
              <div :class="[prefixCls + '-nav']" ref="nav">
                <div :class="barClasses" :style="barStyle"></div>
                <div :class="tabCls(item)" v-for="(item, index) in navList" @click="handleChange(index)" :key="index" @dblclick="handleChange(index,true)">
                  <Icon v-if="item.icon !== ''" :name="item.icon">{{item.icon}}</Icon>
                  <Render v-if="item.labelType === 'function'" :render="item.label"></Render>
                  <template v-else>{{ item.label }}</template>
                  <Icon v-if="showClose(item)" name="close" @click.native.stop="handleRemove(index)"></Icon>
                </div>
              </div>
              <div :class="[prefixCls + '-nav-right']" v-if="showSlot"><slot name="extra"></slot></div>
            </div>
          </div>
          <div v-if="showArrow" :class="[prefixCls + '-enter']" v-on:click = "rightClick($event)">
            <Icon name="enter"></Icon>
          </div>
        </div>
      </div>
    </template>
    <template v-if="panelRight">
      <div :class="barRight" :style="barRightStyle">
        <div :class="[prefixCls + '-nav-container']">
          <div :class="[prefixCls + '-nav-right']" ref="nav">
            <!-- <div :class="barClasses" :style="barStyle"></div> -->
            <div :class="tabCls(item)" v-for="(item, index) in navList" @click="handleChange(index)" :key="index">
              <Render v-if="item.labelType === 'function'" :render="item.label"></Render>
              <template v-else>{{ item.label }}</template>
              <Icon name="arrow-right-b" size="14"></Icon>
            </div>
          </div>          
        </div>
      </div>
      <div :class="contentClasses" :style="contentRightStyle"><slot></slot></div>
      <!-- <div :class="contentClasses"><slot></slot></div> -->
    </template>
    <template v-if="!panelAbove&&!panelRight">
      <div :class="[prefixCls + '-bar']">
        <div :class="[prefixCls + '-nav-container']">
          <div v-if="showArrow" :class="[prefixCls + '-return']" v-on:click = "leftClick($event)" >
            <Icon name="return"></Icon>
          </div>
          <div :class="navWrap"  style="float:left">
            <div :class="[prefixCls + '-nav-scroll']">
              <div :class="[prefixCls + '-nav']" ref="nav">
                <div :class="barClasses" :style="barStyle"></div>
                <div :class="tabCls(item)" v-for="(item, index) in navList" @click="handleChange(index)" :key="index">
                  <Icon v-if="item.icon !== ''" :name="item.icon">{{item.icon}}</Icon>
                  <Render v-if="item.labelType === 'function'" :render="item.label"></Render>
                  <template v-else>{{ item.label }}</template>
                  <Icon v-if="showClose(item)" name="close" @click.native.stop="handleRemove(index)"></Icon>
                </div>
              </div>
              <div :class="[prefixCls + '-nav-right']" v-if="showSlot"><slot name="extra"></slot></div>
            </div>
          </div>
          <div v-if="showArrow" :class="[prefixCls + '-enter']" v-on:click = "rightClick($event)">
            <Icon name="enter"></Icon>
          </div>
        </div>
      </div>
      <div :class="contentClasses" :style="contentStyle"><slot></slot></div>
    </template>
  </div>
</template>
<script>
  import Icon from '../Icon/Icon.vue';
  import Render from '../Notice/render';
  import { oneOf, getStyle, findInx} from '../../util/tools';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-tabs';

  export default {
    name: 'Tabs',
    mixins: [ Emitter ],
    components: { Icon, Render },
    props: {
      value: {
        type: [String, Number]
      },
      type: {
        validator (value) {
          return oneOf(value, ['line', 'card']);
        },
        default: 'line'
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'default']);
        },
        default: 'default'
      },
      animated: {
        type: Boolean,
        default: true
      },
      closable: {
        type: Boolean,
        default: false
      },
      showArrow:{
        type:Boolean,
        default: false
      },
      panelAbove:{
        type:Boolean,
        default: false,
      },
      panelRight:{
        type:Boolean,
        default: false,
      },
      panelLeft:{
        type:Boolean,
        default: false,
      },
      height:{//panelRight panelLeft
        type:[Number,String],
        default:300,
      },
      labelWidth:{
        type:Number,
        default:20,
      },
      alginDre:{
        validator (value) {
          return oneOf(value, ['left', 'right']);
        },
        default: 'right'
      },
      isRemoveTab:{
        type:Boolean,
        default: true,
      },
    },
    data () {
      return {
        prefixCls: prefixCls,
        navList: [],
        barWidth: 0,
        barOffset: 0,
        activeKey: this.value,
        showSlot: false,
        scrollLeft:0,
        scrollRight:null
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-card`]: this.type === 'card'&&!this.panelAbove&&!this.panelRight,
            [`${prefixCls}-card-top`]: this.type === 'card'&&this.panelAbove&&!this.panelRight,
            [`${prefixCls}-mini`]: this.size === 'small' && this.type === 'line'&&!this.panelRight,
            [`${prefixCls}-no-animation`]: !this.animated,
            [`${prefixCls}-panel-right`]: this.panelRight,
            [`clearfix`]: this.panelRight,
          }
        ];
      },
      barTop(){
        return {
          [`${prefixCls}-bar`]:this.type !== 'card',
          [`${prefixCls}-bar-top`]:this.type === 'card',
        }
      },
      barRight(){
        return {
          [`${prefixCls}-bar-right`]:this.panelRight,
        }
      },
      barRightStyle(){
        let style={}
        style.width = this.labelWidth+'%';
        return style;
      },
      navWrap(){
        return [
          `${prefixCls}-nav-wrap`,
          {
            [`${prefixCls}-nav-wrap-width`]: !!this.showArrow
          }
        ]
      },
      contentClasses () {
        return [
          `${prefixCls}-content`,
          {
            [`${prefixCls}-content-animated`]: this.animated,
            [`${prefixCls}-content-right`]: this.panelRight,
          }
        ];
      },
      barClasses () {
        return [
          `${prefixCls}-ink-bar`,
          {
            [`${prefixCls}-ink-bar-animated`]: this.animated
          }
        ];
      },
      contentStyle () {
        const x = findInx(this.navList,(nav) => nav.name === this.activeKey);
        // const x = this.navList.findIndex((nav) => nav.name === this.activeKey);
        const p = x === 0 ? '0%' : `-${x}00%`;

        let style = {};
        if (x > -1) {
          style = {
            transform: `translateX(${p}) translateZ(0px)`
          };
        }
        return style;
      },
      contentRightStyle(){
        let style={};
        style.minHeight=this.height+'px';
        style.width = Number(100-Number(this.labelWidth))+'%';
        return style;
      },
      barStyle () {
        let style = {
          display: 'none',
          width: `${this.barWidth}px`
        };
        if (this.type === 'line') style.display = 'block';
        if (this.animated) {
          style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
        } else {
          style.left = `${this.barOffset}px`;
        }
        return style;
      },
      navStyle(){
        let style = {
          magrinLeft:`${this.scrollLeft}px`,
          marginRight:`${this.scrollright}px`,
        };
        return style;
      }
    },
    methods: {
      getTabs () {
        return this.$children.filter(item => item.$options.name === 'TabPane');
      },
      updateNav () {
        this.navList = [];
        this.getTabs().forEach((pane, index) => {
          this.navList.push({
            labelType: typeof pane.label,
            label: pane.label,
            icon: pane.icon || '',
            name: pane.currentName || index,
            disabled: pane.disabled,
            closable: pane.closable
          });
          if (!pane.currentName) pane.currentName = index;
          if (index === 0) {
            if (!this.activeKey) this.activeKey = pane.currentName || index;
          }
        });
        this.updateStatus();
        this.updateBar();
      },
      updateBar () {
        this.$nextTick(() => {
          const index = this.navList.findIndex((nav) => nav.name === this.activeKey);
          const prevTabs = this.$refs.nav.querySelectorAll(`.${prefixCls}-tab`);
          const tab = prevTabs[index];
          // this.barWidth = parseFloat(getStyle(tab, 'width'));
          if (tab) {
            this.barWidth = tab.getBoundingClientRect().width;
          }
          // if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //   this.barWidth = parseFloat(getStyle(tab, 'width')) + 32;
          // }

          if (index > 0) {
            let offset = 0;
            const gutter = this.size === 'small' ? 0 : 16;
            for (let i = 0; i < index; i++) {
              if (prevTabs[i]) {
                 offset += prevTabs[i].getBoundingClientRect().width + gutter;
              }
              // offset += parseFloat(getStyle(prevTabs[i], 'width')) + gutter;
              // if (!!window.ActiveXObject || "ActiveXObject" in window) {
              //   offset = (parseFloat(getStyle(tab, 'width')) + 32)*(i+1) + gutter*(i+1);
              // }
            }
            this.barOffset = offset;
          } else {
            this.barOffset = 0;
          }
        });
      },
      updateStatus () {
        const tabs = this.getTabs();
        if (!this.panelRight) {
          tabs.forEach(tab => tab.show = (tab.currentName === this.activeKey) || this.animated);
        }else{
          tabs.forEach(tab => tab.show = (tab.currentName === this.activeKey));
        }
      },
      tabCls (item) {
        return [
          `${prefixCls}-tab`,
          {
            [`${prefixCls}-tab-disabled`]: item.disabled,
            [`${prefixCls}-tab-active`]: item.name === this.activeKey,
            [`${prefixCls}-tab-alginleft`]: this.alginDre == 'left',
          }
        ];
      },
      handleChange (index,isDblClick) {
        const nav = this.navList[index];
        if (nav.disabled) return;
        this.activeKey = nav.name;
        this.$emit('input', nav.name);
        if(isDblClick){
          this.$emit('on-dblclick', nav.name);          
        }else{
          this.$emit('on-click', nav.name);
        }
      },
      handleRemove (index,status=false) {
        const tabs = this.getTabs();
        const tab = tabs[index];
        if(!this.isRemoveTab && !status) this.$emit('on-before-tab-remove',index,tab.currentName);
        if(!this.isRemoveTab && !status) return false;
        tab.$destroy();

        if (tab.currentName === this.activeKey) {
          const newTabs = this.getTabs();
          let activeKey = -1;

          if (newTabs.length) {
            const leftNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex < index);
            const rightNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex > index);

            if (rightNoDisabledTabs.length) {
                activeKey = rightNoDisabledTabs[0].currentName;
            } else if (leftNoDisabledTabs.length) {
                activeKey = leftNoDisabledTabs[leftNoDisabledTabs.length - 1].currentName;
            } else {
                activeKey = newTabs[0].currentName;
            }
          }
          this.activeKey = activeKey;
          this.$emit('input', activeKey);
        }
        this.$emit('on-tab-remove', tab.currentName);
        this.updateNav();
      },
      showClose (item) {
        if (this.type === 'card') {
          if (item.closable !== null) {
              return item.closable;
          } else {
              return this.closable;
          }
        } else {
          return false;
        }
      },
      leftClick(e){
        this.$refs.nav.style.float = 'left';
      },
      rightClick(e){
        this.$refs.nav.style.float = 'right';
      }
    },
    watch: {
      value (val) {
        this.activeKey = val;
      },
      activeKey () {
        this.updateBar();
        this.updateStatus();
        this.broadcast('Table', 'on-visible-change', true);
      }
    },
    mounted () {
      this.showSlot = this.$slots.extra !== undefined;
    }
  };
</script>
