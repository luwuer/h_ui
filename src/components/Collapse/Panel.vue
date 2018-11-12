<template>
  <div :class="itemClasses">
    <div :class="headerClasses" @click="toggle">
      <Icon name="ios-arrow-right"></Icon>
      <slot></slot>
    </div>
    <collapse-transition>
      <div :class="contentClasses" v-show="isActive">
        <div :class="boxClasses" v-show="isShowBox"><slot name="content"></slot></div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
  import Icon from '../Icon/Icon.vue';
  import CollapseTransition from '../Notice/collapse-transition';
  const prefixCls = 'h-collapse';

  export default {
    name: 'Panel',
    components: { Icon, CollapseTransition },
    props: {
      name: {
        type: String
      }
    },
    data () {
      return {
        index: 0, // use index for default when name is null
        isActive: false,
        isShowBox: this.$parent.noContentBox ? false : true
      };
    },
    computed: {
        itemClasses () {
            return [
                `${prefixCls}-item`,
                {
                    [`${prefixCls}-item-active`]: this.isActive
                }
            ];
        },
        headerClasses () {
            return `${prefixCls}-header`;
        },
        contentClasses () {
            return `${prefixCls}-content`;
        },
        boxClasses () {
            return `${prefixCls}-content-box`;
        }
    },
    updated() {
      if (this.isActive && this.$parent.noContentBox) {
        this.$nextTick(() => {
          if (this.$slots.content && (this.$slots.content [0].elm.children.length > 0 || this.$slots.content [0].elm.innerText)){
            this.isShowBox = true
          } else {
            this.isShowBox = false
          }
        })
      }
    },
    methods: {
      toggle () {
        this.$parent.toggle({
          name: this.name || this.index,
          isActive: this.isActive
        });
      }
    },
    mounted () {
      // slot content 内容为空或者content 不存在
      if (this.$parent.noContentBox) {
        if (this.$slots.content && (this.$slots.content[0].elm.innerText || this.$slots.content[0].elm.children.length > 0)) {
          this.isShowBox = true
        }
      }
    },
  };
</script>
