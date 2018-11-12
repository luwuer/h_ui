<template>
  <li :class="classes">
    {{ data.label }}
    <Icon v-if="showArrow" name="ios-arrow-right"></Icon>
    <Icon v-if="showLoading" class="h-load-loop" name="load-c"></Icon>
  </li>
</template>
<script>
  import Icon from '../Icon/Icon.vue'
  export default {
    name: 'Casitem',
    components:{Icon},
    props: {
        data: Object,
        prefixCls: String,
        tmpItem: Object
    },
    computed: {
      classes () {
        return [
          `${this.prefixCls}-menu-item`,
          {
            [`${this.prefixCls}-menu-item-active`]: this.tmpItem.value === this.data.value,
            [`${this.prefixCls}-menu-item-disabled`]: this.data.disabled
          }
        ];
      },
      showArrow () {
        return (this.data.children && this.data.children.length) || ('loading' in this.data && !this.data.loading);
      },
      showLoading () {
        return 'loading' in this.data && this.data.loading;
      }
    }
  };
</script>
