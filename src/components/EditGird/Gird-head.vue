<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styles">
  <!-- 签用于对表格中的列进行组合，以便对其进行格式化。 -->
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)" :key="index">
    </colgroup>
    <thead>
      <tr>
        <th v-for="(column, index) in columns"
          :class="alignCls(column)" 
          :key="index"
          >
          <div :class="cellClasses(column)">
            <template v-if="column.type === 'expand'"></template>
            <template v-else-if="column.type === 'selection'">
              <Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox>
            </template>
            <template v-else>
              <span v-if="!column.renderHeader" @click="handleSortByHead(index)">{{ column.title || '#' }}</span>
              <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
            </template>
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script>
import Icon from '../Icon/Icon.vue'
import CheckboxGroup from '../Checkbox/CheckboxGroup.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
import hButton from '../Button/Button.vue';
import renderHeader from './header';
import { on, off } from '../../util/dom';
import {getScrollBarSize,hasClass,addClass,removeClass} from '../../util/tools';
import Mixin from './mixin';
import Locale from '../../mixins/locale';

export default {
  name: 'GirdHead',
  mixins: [ Mixin, Locale ],
  components: {CheckboxGroup, Checkbox,hButton, renderHeader,Icon},
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    objData: Object,
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // data: Array,    // rebuildData for sort or filter
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    },
  },
  data(){
    return{
      draggingColumn: null,
      dragging: false,
      dragState: {}
    }
  },
  computed: {
    styles () {//深拷贝
      const style = Object.assign({}, this.styleObject);
      const width = this.$parent.bodyHeight === 0 ? parseInt(this.styleObject.width) : parseInt(this.styleObject.width) + this.$parent.scrollBarWidth;
      style.width = `${width}px`;
      return style;
    },
    isSelectAll () {
      let isSelectAll = true;
      if (!this.data.length) isSelectAll = false;
      for (let i = 0; i < this.data.length; i++) {
        if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
          isSelectAll = false;
          break;
        }
      }
      return isSelectAll;
    }
  },
  mounted(){
  },
  methods: {
    cellClasses (column) {
      return [
        `${this.prefixCls}-cell`,
      ];
    },
    selectAll () {
      const status = !this.isSelectAll;
      this.$parent.selectAll(status);
    },
    handleSortByHead (index) {
    }
  }
};
</script>
