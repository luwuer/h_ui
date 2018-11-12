<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject" ref="tBody">
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, false)">
    </colgroup>
    <tbody :class="[prefixCls + '-tbody']">
      <template v-for="(row, index) in treeData">
        <table-tr
          :row="row"
          :key="index"
          :prefix-cls="prefixCls"
          @mouseenter.native.stop="handleMouseIn(index)"
          @mouseleave.native.stop="handleMouseOut(index)"
          @click.native="clickCurrentRow(index)"
          v-show="show(row)" :class="{'child-tr':row._parent}">
          <td v-for="(column,inx) in columns" :class="alignCls(column, row)" >
             <Cell
              :prefix-cls="prefixCls"
              :row="row"
              :parent="parent"
              :key="column._columnKey"
              :column="column"
              :natural-index="index"
              :columnIndex = "inx"
              :index="index"
              :checked="rowChecked(index)"
              :disabled="rowDisabled(index)"
              :expanded="rowExpanded(index)"
              :showEditInput="showEditInput"
              :option="option[inx]"
              :treeOption="treeOption[inx]"
              @on-editselect-change="editselectChange"
              @on-editinput-change="editinputChange"
              @on-editinput-blur="editinputBlur"
              @on-editarea-change="editAreaChange"
              @on-editarea-blur="editAreaBlur"
            >
              <span v-if="inx==(columns[0].type=='index'?1:0)">
                <i v-html='row._spaceHtml'></i>
                <Icon name = "play_fill" :class="iconClass(index)" v-if="showArrow(row)" @on-click="toggleExpand(index, row,$event)"></Icon>
                 <Icon v-else-if="showLoading(index)" name="load-c" class="h-load-loop"></Icon> 
                 <i v-else class="h-tree-space"></i> 
                <Checkbox v-if="isCheckbox" :value="row.checked" :indeterminate="row._indeterminate" @on-click="changeSelect(row,index,$event)"></Checkbox> 
              </span>
            </Cell> 
          </td>
        </table-tr>
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
    import Icon from '../Icon/Icon.vue'
    import CollapseTransition from '../Notice/collapse-transition';
    export default {
      name: 'TableBody',
      mixins: [ Mixin ],
      components: { Cell, Expand, TableTr,Icon,CollapseTransition},
      props: {
        prefixCls: String,
        styleObject: Object,
        columns: Array,
        data: Array,    // rebuildData
        objData: Object,
        columnsWidth: Object,
        rowSelect: Boolean,
        showEditInput:Boolean,
        isCheckbox:Boolean,
        checkStrictly:Boolean,
        option:Array,
        treeOption:Array,
      },
      data(){
        return{
          treeData : this.data,
          parent:this.$parent,
          flatState:[],
        }
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
        },
      },
      methods: {
        iconClass(_index){
          return[
            `${this.prefixCls}-icon-click`,
            {
              [`${this.prefixCls}-icon-click-expanded`]:this.objData[_index]._isExpanded,
            }
          ]
        },
        rowChecked (_index) {
          return this.objData[_index] && this.objData[_index]._isChecked;
        },
        rowDisabled(_index){
          return this.objData[_index] && this.objData[_index]._isDisabled;
        },
        rowExpanded(_index){
          return this.objData[_index] && this.objData[_index]._isExpanded;
        },
        handleMouseIn (_index) {
          this.$parent.handleMouseIn(_index);
        },
        handleMouseOut (_index) {
          this.$parent.handleMouseOut(_index);
        },
        clickCurrentRow (_index) {
          this.$parent.clickCurrentRow(_index);
          if(this.rowSelect){
            this.$parent.toggleSelect(_index);
          }
        },
        toggleExpand (index, row,e) {
          e.stopPropagation(); 
          this.$parent.toggleExpand(index, row);
        },
        //-- 显示与隐藏
        show (row) {
          return ((row._level == 1) || (row._parent && row._parent.expand && row._isShow));
        },
        updateCheckUp(index){
          if(this.treeData[index]._parent === null) return  
          const parentIndex = this.treeData[index]._parent._index
          
          const parent = this.treeData[parentIndex]
          const node = this.treeData[index];
          if (node.checked == parent.checked && node._indeterminate == parent._indeterminate) return; // no need to update upwards
          if (node.checked == true) {
            let curStatus = parent.children.every(node => node.checked)
            this.$set(parent, 'checked', curStatus);
            this.$parent.objData[parent._index]._isChecked = curStatus;
            this.$set(parent, '_indeterminate', !parent.checked&&!this.showIndeterminate);
          } else {
            this.$set(parent, 'checked', false);
            this.$parent.objData[parent._index]._isChecked = false;
            this.$set(parent, '_indeterminate', parent.children.some(node => node.checked || node._indeterminate));
          }
          this.updateCheckUp(parentIndex);
        },
        changeSelect (row,index,e) {
          let selectInx=[];
          e.stopPropagation(); 
          let status = !row.checked;
          const node = this.treeData[index]
          this.$set(node, 'checked', status);
          this.$parent.objData[index]._isChecked = status;
          this.$set(node, '_indeterminate', false);
          if (!this.checkStrictly) {
            this.updateCheckUp(index)
            this.updateCheckDown(node,{checked:status, _indeterminate: false});
          }
          this.$parent.selectChange();
        },
        updateCheckDown(node,changes = {}){
          for (let key in changes) {
            this.$set(node, key, changes[key]);
          }
          // 未expand时 没有makeobjdata 创建_isChecked属性
          if (this.$parent.objData[node._index]) this.$parent.objData[node._index]._isChecked =changes['checked'];
          if (node.children && node.children.length>0 && !this.checkStrictly && !node.leaf) {
            node.children.forEach(child => {
                this.updateCheckDown(child, changes);
            });
          }
        },
        editselectChange(val,i,j){
          this.$emit('on-editselect-change',val,i,j);
        },
        editinputChange(val,i,j){
          this.$emit('on-editinput-change',val,i,j);
        },
        editinputBlur(val,i,j){
          this.$emit('on-editinput-blur',val,i,j);
        },
        editAreaChange(val,i,j){
          this.$emit('on-editarea-change',val,i,j);
        },
        editAreaBlur(val,i,j){
          this.$emit('on-editarea-blur',val,i,j);
        },
        renderBody (row, column) {
          return row[column.key]
        },
        // 是否显示父节点图标
        showArrow (row) {
          return row.children && row.children.length!= 0  && !row.leaf || ('loading' in row && !row.loading) && !row.leaf && this.$parent.loadData
        },
        showLoading (index) {
          return 'loading' in this.treeData[index] && this.treeData[index].loading && !this.treeData[index].leaf;
        }
      },
      mounted(){
          this.treeData = this.data;
          this.flatState = this.data
      },
      watch:{
        data: {
          handler (val) {
            this.treeData = this.data
            this.flatState = this.data
          },
          deep: true
        }
      }
    };
</script>
