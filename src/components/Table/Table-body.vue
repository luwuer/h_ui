<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject" ref="tBody">
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, false)" :key="index">
    </colgroup>
    <tbody :class="[prefixCls + '-tbody']">
      <template v-for="(row, index) in data">
        <table-tr
          :row="row"
          :key="row._rowKey"
          :prefix-cls="prefixCls"
          @mouseenter.native.stop="handleMouseIn(row._index)"
          @mouseleave.native.stop="handleMouseOut(row._index)"
          @click.native="clickCurrentRow(row._index)"
          @dblclick.native.stop="dblclickCurrentRow(row._index)">
          <td v-for="(column, columnIdx) in columns" :class="alignCls(column, row)">
            <Cell
              :fixed="fixed"
              :prefix-cls="prefixCls"
              :row="row"
              :key="column._columnKey"
              :column="column"
              :natural-index="index"
              :index="row._index"
              :checked="rowChecked(row._index)"
              :disabled="rowDisabled(row._index)"
              :expanded="rowExpanded(row._index)"
              :showTitle = "showTitle"
              :sum = 'sum'
              :columnIdx = 'columnIdx'
            ></Cell>
          </td>
        </table-tr>
        <tr v-if="rowExpanded(row._index)">
          <td :colspan="columns.length" :class="prefixCls + '-expanded-cell'">
            <Expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index" :fixed="fixed"></Expand>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>
    // todo :key="row"
    import TableTr from './Table-tr.vue';
    import Cell from './Cell.vue';
    import Expand from './expand.js';
    import Mixin from './mixin';

    export default {
      name: 'TableBody',
      mixins: [ Mixin ],
      components: { Cell, Expand, TableTr },
      props: {
        prefixCls: String,
        styleObject: Object,
        columns: Array,
        data: Array,    // rebuildData
        objData: Object,
        columnsWidth: Object,
        rowSelect: Boolean,
        fixed: {
          type: [Boolean, String],
          default: false
        },
        bodyAlgin:String,
        showTitle:Boolean,
        sum: Boolean

      },
      computed: {
        expandRender () {
          let render = function () {
            return '';
          };
          for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            if (column.type && column.type === 'expand') {
              if (column.render) render = column.render;
            }
          }
          return render;
        }
      },
      methods: {
        rowChecked (_index) {
          if (this.sum) return           
          return this.objData[_index] && this.objData[_index]._isChecked;
        },
        rowDisabled(_index){
          if (this.sum) return           
          return this.objData[_index] && this.objData[_index]._isDisabled;
        },
        rowExpanded(_index){
          if (this.sum) return           
          return this.objData[_index] && this.objData[_index]._isExpanded;
        },
        handleMouseIn (_index) {
          if (this.sum) return 
          this.$parent.handleMouseIn(_index);
        },
        handleMouseOut (_index) {
          if (this.sum) return           
          this.$parent.handleMouseOut(_index);
        },
        clickCurrentRow (_index) {
          if (this.sum) return           
          if(this.rowSelect){
            // this.objData[_index]._isChecked=!this.objData[_index]._isChecked;
            this.$parent.toggleSelect(_index);
          }else{
            this.$parent.clickCurrentRow(_index);
          }
        },
        dblclickCurrentRow (_index) {
          if (this.sum) return           
          if (!this.rowSelect) {
            this.$parent.dblclickCurrentRow(_index);
          }
        }
      }
    };
</script>
