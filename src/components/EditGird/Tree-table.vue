<template>
  <tr>
    <td :colspan="columns.length" style="border:0">
      <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
        <colgroup>
          <col v-for="(column, index) in columns" :width="setCellWidth(column, index, false)">
        </colgroup>
        <tbody :class="[prefixCls + '-tbody']">
          <template v-for="(row,index) in data">
            <tr :class="rowClasses(row._index)"
              @mouseenter="handleMouseIn(row._index)"
              @mouseleave="handleMouseOut(row._index)"
              @click="clickCurrentRow(row._index)">
              <td v-for="(column,inx) in columns" :class="alignCls(column, row)">
                <Cell
                  :prefix-cls="prefixCls"
                  :typeName = "typeName"
                  :row="row"
                  :parent="parent"
                  :key="column._columnKey"
                  :column="column"
                  :natural-index="index"
                  :index="row._index"
                  :checked="rowChecked(row._index)"
                  :disabled="rowDisabled(row._index)"
                  :expanded="rowExpanded(row._index)"
                  :showEditInput="showEditInput"
                  :option="option"
                  :treeOption="treeOption"
                >
                  <span v-if="inx==(columns[0].type=='index'?1:0)" :style="indentCls" >
                    <Icon v-if="row.children && row.children.length!=0" :class="iconClass(row._index)" name = "play_fill" @on-click="toggleExpand(row._index,$event)"></Icon>
                    <Checkbox v-if="isCheckbox" :value="row.checked" :indeterminate="row.indeterminate" @on-click="changeSelect(row,$event)"></Checkbox> 
                  </span>
                </Cell>
              </td>
            </tr>
            <collapse-transition>
            <Tree-table
              v-if="objData[row._index]._isExpanded && row.children && row.children.length!=0"
              :styleObject = "styleObject"
              :parent="parent"
              :indent = "Number(indent+1)"
              :data="row.children"
              :prefix-cls="prefixCls"
              :typeName = "typeName"
              :columns = "columns"
              :columnsWidth="columnsWidth"
              :showEditInput="showEditInput"
              :isCheckbox="isCheckbox">
            </Tree-table>
            </collapse-transition>
          </template>
        </tbody>
      </table>
    </td>
  </tr>
</template>
<script>
  import CollapseTransition from '../Notice/collapse-transition';
  import Cell from './Cell.vue'
  import Mixin from './mixin';
  export default {
    name:'TreeTable',
    mixins: [ Mixin ],
    components: {CollapseTransition,Cell},
    props: {
      styleObject: Object,
      columns:Array,
      indent:Number,
      parent:Object,
      // data: Array,
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      prefixCls: String,
      typeName:String,
      showEditInput:Boolean,
      isCheckbox:Boolean,
      option:Array,
      treeOption:Array,
      columnsWidth:Object,
    },
    computed: {
      objData () {
        return this.$parent.objData;
      },
      indentCls (){
        let style={};
        style.marginLeft = 20*this.indent+'px';
        return style;
      }
    },
    methods: {
      rowClasses (_index) {
        let _isChecked,_isHighlight,_isHover;
        _isChecked = this.objData[_index] && this.objData[_index]._isChecked;
        _isHighlight =this.objData[_index] && this.objData[_index]._isHighlight;
        _isHover = this.objData[_index] && this.objData[_index]._isHover;
        return [
          `${this.prefixCls}-row`,
          // this.rowClsName(_index),
          {
            [`${this.prefixCls}-row-checked`]: _isChecked,
            [`${this.prefixCls}-row-highlight`]:_isHighlight,
            [`${this.prefixCls}-row-hover`]:_isHover
          }
        ];
      },
      iconClass(_index){
        return this.$parent.iconClass(_index);
      },
      rowClsName (_index) {
        return this.$parent.$parent.rowClassName(this.objData[_index], _index);
      },
      rowChecked (_index){
        return this.objData[_index] && this.objData[_index]._isChecked;
      },
      rowDisabled(_index){
        return this.objData[_index] && this.objData[_index]._isDisabled;
      },
      rowExpanded(_index){
        return this.objData[_index] && this.objData[_index]._isExpanded;
      },
      handleMouseIn (_index) {
        this.$parent.$parent.handleMouseIn(_index);
      },
      handleMouseOut (_index) {
        this.$parent.$parent.handleMouseOut(_index);
      },
      clickCurrentRow (_index) {
        this.$parent.$parent.clickCurrentRow(_index);
        if(this.rowSelect){
          // this.objData[_index]._isChecked=!this.objData[_index]._isChecked;
          this.$parent.toggleSelect(_index);
        }
      },
      toggleExpand (index,e) {
        this.$parent.toggleExpand(index,e);
      },
      changeSelect(row,e){
        this.$parent.changeSelect(row,e);
      }
    }
  };
</script>