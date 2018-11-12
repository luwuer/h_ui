<template>
  <div :class="classes" ref="cell">
    <template v-if="renderType === 'index'">{{index + 1}}</template>
    <template v-if="renderType === 'selection'">
      <Checkbox size="large" :value="checked" @click.native.stop="handleClick" @on-change="toggleSelect" :disabled="disabled"></Checkbox>
    </template>
    <template v-if="renderType === 'normal'" >
      <span v-html="row[column.key]"></span>
    </template>
    <Cell
      v-if="renderType === 'render'"
      :row="row"
      :column="column"
      :index="index"
      :render="column.render"></Cell>
  </div>
</template>
<script>
import Cell from './expand';
import Icon from '../Icon/Icon.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
import {addClass,removeClass} from '../../util/tools.js'

export default {
  name: 'TableCell',
  components: { Icon, Checkbox, Cell },
  props: {
    prefixCls: String,
    row: Object,
    column: Object,
    index: Number,           // _index of data
    checked: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    fixed: {
      type: [Boolean, String],
      default: false
    },
    showTitle:Boolean,
    sum: Boolean,
    columnIdx: Number
  },
  data () {
    return {
      renderType: '',
      uid: -1,
      tChecked:this.checked,
    };
  },
  computed: {
    classes () {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]: !this.fixed && this.column.fixed && (this.column.fixed === 'left'),
          [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis&&this.column.ellipsis!='false',
        }
      ];
    },
    expandCls () {
      return [
        `${this.prefixCls}-cell-expand`,
        {
          [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
        }
      ];
    },
  },
  methods: {
      toggleSelect () {
        this.$parent.$parent.toggleSelect(this.index);
      },
      handleClick () {
          // 放置 Checkbox 冒泡
      },
  },
  created () {
    if (this.column.type === 'index') {
        this.renderType = 'index';
    } else if (this.column.type === 'selection') {
        this.renderType = 'selection';
    } else if (this.column.render) {
        this.renderType = 'render';
    } else{
        this.renderType = 'normal';
    }
  },
  mounted(){
    // if (this.column.ellipsis&&this.column.ellipsis!="false") {
    //   this.titleText = this.row[this.column.key];
    // }else{
    //   this.titleText = null;
    // }
  },
  watch:{
    checked(val){
      this.tChecked=val;
    }
  }
};
</script>
