<template>
  <h-menu-collapse-transition>
    <ul :class="classes" :style="styles"><slot></slot></ul>
  </h-menu-collapse-transition>
</template>
<script>
import { oneOf, findComponentsDownward, hasClass, addClass, removeClass} from '../../util/tools';
import Emitter from '../../mixins/emitter';

const prefixCls = 'h-menu';

export default {
  name: 'Menu',
  mixins: [ Emitter ],
  provide() {
    return {
      rootMenu: this
    }
  },
  components: {
    // 函数式组件
    'h-menu-collapse-transition' : {
      functional: true,
      render(createElement, context) {
        const data = {
          props: {
            mode: 'out-in'
          },
          on: {
            beforeEnter(el) {
              el.style.opacity = 0.2
            },
            enter(el) {
              addClass(el, 'h-opacity-transition')
              el.style.opacity = 1
            },
            afterEnter(el) {
              removeClass(el, 'h-opacity-transition')
              el.style.opacity = ''
            },
            // beforeLeave(el) {
            //   if(!el.dataset) el.dataset = {}
            //   if(hasClass(el, 'h-menu-collapse')) {
            //     removeClass(el, 'h-menu-collapse')
            //     el.dataset.oldOverflow = el.style.overflow
            //     el.dataset.scrollWidth = el.scrollWidth
            //     addClass(el, 'h-menu-collapse')
            //   }
            //   el.style.width = el.scrollWidth + 'px'
            //   el.style.overflow = 'hidden'
            // },
            // leave(el) {
            //   if (!hasClass(el, 'h-menu-collapse')) {
            //       addClass(el, 'horizontal-collapse-transition');
            //       el.style.width = '64px';
            //   } else {
            //     addClass(el, 'horizontal-collapse-transition');
            //     el.style.width = el.dataset.scrollWidth + 'px';
            //   }
            // }
          }
        }
        return createElement('transition', data, context.children)
      }
    }
  },
  props: {
    mode: {
      validator (value) {
          return oneOf(value, ['horizontal', 'vertical']);
      },
      default: 'vertical'
    },
    theme: {
      validator (value) {
          return oneOf(value, ['light', 'dark', 'primary']);
      },
      default: 'light'
    },
    // 激活菜单的 name 值
    activeName: {
      type: [String, Number]
    },
    // 展开的 Submenu 的 name 集合
    openNames: {
      type: Array,
      default () {
          return [];
      }
    },
    // 手风琴模式，开启后每次至多展开一个子菜单
    accordion: {
      type: Boolean,
      default: false
    },
    // 只在 mode="vertical" 时有效
    width: {
      type: [String, Number],
      default: 240
    },
    // 只在 mode="vertical" 时有效,是否水平展开菜单
    // --collapse--
    collapse: {
      type: Boolean,
      default: false
    },
    shrinkClose: {
      type: Boolean,
      default: false,
    },
    // --collapse--
    // 只在 mode="vertical" 时有效,三级菜单侧面展开
    vertiSide:{
      type:Boolean,
      default:false,
    }
  },
  data () {
    return {
      currentActiveName: this.activeName,
      openName:this.openNames
    };
  },
  computed: {
    classes () {
      let theme = this.theme;
      if (this.mode === 'vertical' && this.theme === 'primary') theme = 'light';

      return [
        `${prefixCls}`,
        `${prefixCls}-${theme}`,
        {
          [`${prefixCls}-${this.mode}`]: this.mode,
          [`${prefixCls}-collapse`]: this.collapse,
          [`${prefixCls}-verti-side`]: this.vertiSide && !this.collapse,
        }
      ];
    },
    styles () {
      let style = {};

      if (this.mode === 'vertical' && !this.collapse) style.width = this.width+'px';

      return style;
    }
  },
  methods: {
    updateActiveName () {
      if (this.currentActiveName === undefined) {
          this.currentActiveName = -1;
      }
      this.broadcast('Submenu', 'on-update-active-name', false);
      this.broadcast('MenuItem', 'on-update-active-name', this.currentActiveName);
    },
    updateOpenKeys (name) {
      const index = this.openName.indexOf(name);
        if (index > -1) {
          this.openName.splice(index, 1);
        } else {
          this.openName.push(name);
          if (this.accordion) {
            this.openName.splice(0, this.openName.length);
            this.openName.push(name);
          }
        }
    },
    updateOpened () {
      const items = findComponentsDownward(this, 'Submenu');
      if(this.collapse) return;
      // debugger;
      if (items.length) {
        items.forEach(item => {
          if (this.openName.indexOf(item.name) > -1) item.opened = true;
        });
      }
    }
  },
  mounted () {
    this.updateActiveName();
    this.updateOpened();
    this.$on('on-menu-item-select', (name) => {
      this.currentActiveName = name;
       // --collapse--为true时，openedMenu置空
      if(this.collapse) this.openedMenu = []
      // --collapse--
      this.$emit('on-select', name);
    });
    if (this.collapse) {
      this.openName = [];
    }
  },
  watch: {
    openName () {
      this.$emit('on-open-change',this.openName);
    },
    openNames:{
      deep:true,
      handler(){
        this.openName = this.openNames;
        this.updateOpened();
      }
    },
    activeName (val) {
      this.currentActiveName = val;
    },
    currentActiveName () {
      this.updateActiveName();
    },
    // --collapse--
    collapse(value) {
      this.openedMenu = [];
      this.openName = [];
      if(value && this.shrinkClose){
        this.broadcast("Submenu", 'on-collapse-close');
      }
    }
    // --collapse--
  }
};
</script>
