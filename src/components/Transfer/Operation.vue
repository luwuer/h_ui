<template>
  <div :class="prefixCls + '-operation'">
    <template v-if="!contentSplit">
      <h-button type="primary" size="small" :disabled="!rightActive" @click.native="moveToLeft">
        <Icon name="return"></Icon> {{ operations[0] }}
      </h-button>
      <h-button type="primary" size="small" :disabled="!leftActive" @click.native="moveToRight">
        {{ operations[1] }} <Icon name="enter"></Icon>
      </h-button>
      <h-button type="ghost" size="small" @click.native="moveAllToLeft">
        <Icon name="arrow-l"></Icon> {{ operations[2] }}
      </h-button>
      <h-button type="ghost" size="small" @click.native="moveAllToRight">
        {{ operations[3] }} <Icon name="arrow-r"></Icon>
      </h-button>
    </template>
    <template v-else>
      <h-button type="primary" size="small" @click.native="selectAll">
        <Icon name="enter"></Icon>
      </h-button>
    </template>
    <slot>
    </slot>
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
      rightActive: Boolean,
    },
    data(){
      return{
        contentSplit:false,
      }
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
      },
      selectAll(){
        this.$parent.operationsChange();
      }
    },
    mounted(){
      this.contentSplit = this.$parent.contentSplit;
    }
  };
</script>
