<template>
  <li :class="classes" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
    <div :class="[prefixCls + '-submenu-title']" ref="reference" @click="handleClick">
      <slot name="title"></slot>
      <Icon :name="subIcon" :class="[prefixCls + '-submenu-title-icon']"></Icon>
    </div>
    <collapse-transition v-if="mode === 'vertical' &&shrinked">
      <ul :class="[prefixCls]" v-show="opened"><slot></slot></ul>
    </collapse-transition>
    <transition name="slide-up" v-else>
      <Drop
        v-show="opened"
        :placement="subTransPos"
        ref="drop"
        :style="dropStyle"><slot></slot></Drop>
    </transition>
  </li>
</template>
<script>
import Drop from '../Select/Dropdown.vue';
import Icon from '../Icon/Icon.vue';
import CollapseTransition from '../Notice/collapse-transition.js';
import { getStyle, findComponentsUpward } from '../../util/tools';
import Emitter from '../../mixins/emitter';
import MenuMixin from './menu-mixin'

const prefixCls = 'h-menu';

export default {
  name: 'Submenu',
  mixins: [ Emitter ],
  components: { Icon, Drop,CollapseTransition },
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showSlide:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      active: false,
      opened: false,
      dropWidth: parseFloat(getStyle(this.$el, 'width')),
      parent: findComponentsUpward(this, 'Menu'),
      shrinked:true,
    };
  },
  computed: {
    classes () {
      return [
        `${prefixCls}-submenu`,
        {
          [`${prefixCls}-item-active`]: this.active,
          [`${prefixCls}-opened`]: this.opened,
          [`${prefixCls}-submenu-disabled`]: this.disabled
        }
      ];
    },
    subIcon () {
      // 侧边菜单栏伸缩时，改变submenu的图标
      if(this.parent.mode === 'vertical' && this.parent.collapse) {
        return 'enter'
      } else {
        return 'unfold'
      }
    },
    subTransPos () {
      if(this.parent.mode === 'vertical' && this.parent.collapse) {
        return 'left'
      } else {
        return 'bottom'
      } 
    },
    collapse () {
      return this.parent.collapse;
    },
    mode () {
      return this.parent.mode;
    },
    vertiSide () {
      return this.parent.vertiSide;
    },
    accordion () {
      return this.parent.accordion;
    },
    dropStyle () {
      let style = {};

      if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
      return style;
    }
  },
  methods: {
    handleMouseenter () {
      // if (this.parent.) {}
      if (this.disabled) return;
      // if (this.mode === 'vertical') return;
      // collapse为true时，可以鼠标经过
      if (this.mode === 'vertical' && !this.collapse&&!this.showSlide) return;
      
      clearTimeout(this.timeout);
      this.parent.updateOpenKeys(this.name);
      this.timeout = setTimeout(() => {
        this.opened = true;
      }, 250);
    },
    handleMouseleave () {
      if (this.disabled) return;
      // if (this.mode === 'vertical') return;
      // collapse为true时，可以鼠标经过
      if (this.mode === 'vertical' && !this.collapse&&!this.showSlide) return;
      this.parent.updateOpenKeys(this.name);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
          this.opened = false;
      }, 150);
    },
    handleClick () {
      if (this.disabled) return;
      // collapse为true时，触发鼠标经过，因此忽略点击
      if (this.mode === 'horizontal' || this.collapse ) return;
      const opened = this.opened;

      if (this.accordion && this.$parent.$options.name !== 'Submenu') {
        this.parent.$children.forEach(item => {
            if (item.$options.name === 'Submenu') item.opened = false;
        });
      }
      this.opened = !opened;
      this.parent.updateOpenKeys(this.name);
    }
  },
  watch: {
    mode (val) {
      if (val === 'horizontal') {
        this.$refs.drop.update();
      }
    },
    opened (val) {
      if (this.mode === 'vertical') return;
      if (val) {
        // set drop a width to fixed when menu has fixed position
        this.dropWidth = parseFloat(getStyle(this.$el, 'width'));
        this.$refs.drop.update();
      } else {
        this.$refs.drop.destroy();
      }
    }
  },
  mounted () {
    this.$on('on-menu-item-select', (name) => {
      if (this.mode === 'horizontal') this.opened = false;
      this.dispatch('Menu', 'on-menu-item-select', name);
      return true;
    });
    this.$on('on-update-active-name', (status) => {
      this.active = status;
    });
    this.$on('on-collapse-close',()=>{
      this.shrinked = false;
      this.opened=false;
      this.$nextTick(()=>{
        this.shrinked = true;
      })
    })
  }
};
</script>
