<template>
  <div :class="prefixCls + '-operation'">
    <h-button type="primary" size="small" :disabled="!rightActive" @click.native="moveToLeft">
      <Icon name="return"></Icon> {{ operations[0] }}
    </h-button>
    <h-button type="primary" size="small" :disabled="!leftActive" @click.native="moveToRight">
      {{ operations[1] }} <Icon name="enter"></Icon>
    </h-button>
    <h-button type="ghost" size="small" :disabled="!rightActive" @click.native="moveAllToLeft">
      <Icon name="arrow-l"></Icon> {{ operations[2] }}
    </h-button>
    <h-button type="ghost" size="small" :disabled="!leftActive" @click.native="moveAllToRight">
      {{ operations[3] }} <Icon name="arrow-r"></Icon>
    </h-button>
    
  </div>
</template>
<script>
  import hButton from '../Button/Button.vue';
  import Icon from '../Icon/Icon.vue';

  export default {
    name: 'Operation',
    components: { hButton, Icon },
    props: {
      prefixCls: String,
      operations: Array,
      leftActive: Boolean,
      rightActive: Boolean
    },
    methods: {
      moveToLeft () {
        this.$parent.moveTo('left');
      },
      moveToRight () {
        this.$parent.moveTo('right');
      },
      moveAllToLeft () {
        this.$parent.moveAllTo('left');
      },
      moveAllToRight () {
        this.$parent.moveAllTo('right');
      }
    }
  };
</script>
