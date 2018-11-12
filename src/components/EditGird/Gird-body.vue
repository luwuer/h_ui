<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject" ref="tBody">
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, false)">
    </colgroup>
    <tbody :class="[prefixCls + '-tbody']">
      <template v-if="typeName=='editGird'" v-for="(row, index) in data">
        <table-tr
          :row="row"
          :key="row._rowKey"
          :prefix-cls="prefixCls"
          :typeName = "typeName"
          @mouseenter.native.stop="handleMouseIn(row._index)"
          @mouseleave.native.stop="handleMouseOut(row._index)"
          @click.native="clickCurrentRow(row._index)">
          <td v-for="(column,inx) in columns" :class="alignCls(column, row)" :key="inx">
            <Cell
              :fixed="fixed"
              :prefix-cls="prefixCls"
              :row="row"
              :key="column._columnKey"
              :parent="parent"
              :column="column"
              :naturalIndex="index"
              :columnIndex = "inx"
              :index="row._index"
              :checked="rowChecked(row._index)"
              :disabled="rowDisabled(row._index)"
              :expanded="rowExpanded(row._index)"
              :showEditInput="showEditInput"
              :option="selectOption[inx]"
              :treeOption="treeOption[inx]"
              @on-editselect-change="editselectChange"
              @on-editinput-change="editinputChange"
              @on-editinput-blur="editinputBlur"
              @on-editarea-change="editAreaChange"
              @on-editarea-blur="editAreaBlur"
            ></Cell>
          </td>
        </table-tr>
        <tr v-if="rowExpanded(row._index)">
          <td :colspan="columns.length" :class="prefixCls + '-expanded-cell'">

            <Expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index"></Expand>
          </td>
        </tr>
      </template>
      <template v-if="typeName=='groupTable'" v-for="(rowTitle, index) in data">
        <group-tr
          :columns="columns"
          :prefix-cls="prefixCls"
          :rowTitle = "rowTitle"
          :expanded = "Boolean(rowTitle.expand)"
          :checked = "rowChecked(rowTitle._index)">         
        </group-tr>
        <table-tr
          v-if="rowTitle.expand"
          v-for="(row,index) in rowTitle.item"
          :row="row"
          :key="row._rowKey"
          :prefix-cls="prefixCls"
          :typeName = "typeName"
          @mouseenter.native.stop="handleMouseIn(row._index)"
          @mouseleave.native.stop="handleMouseOut(row._index)"
          @click.native="clickCurrentRow(row._index)">
          <td v-for="column in columns" :class="alignCls(column, row)">
            <Cell
              :prefix-cls="prefixCls"
              :row="row"
              :key="column._columnKey"
              :parent="parent"
              :column="column"
              :natural-index="index"
              :index="row._index"
              :checked="rowChecked(row._index)"
              :disabled="rowDisabled(row._index)"
              :expanded="rowExpanded(row._index)"
              :showEditInput="showEditInput"
            ></Cell>
          </td>
        </table-tr>
      </template>
      <template v-if="typeName=='treeGird'" v-for="(row, index) in treeData">
        <table-tr
          :row="row"
          :key="row._rowKey"
          :prefix-cls="prefixCls"
          :typeName = "typeName"
          @mouseenter.native.stop="handleMouseIn(row._index)"
          @mouseleave.native.stop="handleMouseOut(row._index)"
          @click.native="clickCurrentRow(row._index)">
          <td v-for="(column,inx) in columns" :class="alignCls(column, row)" :key="inx">
            <Cell
              :prefix-cls="prefixCls"
              :row="row"
              :parent="parent"
              :typeName="typeName"
              :key="column._columnKey"
              :column="column"
              :natural-index="index"
              :index="row._index"
              :checked="rowChecked(row._index)"
              :disabled="rowDisabled(row._index)"
              :expanded="rowExpanded(row._index)"
              :showEditInput="showEditInput"
              :option="selectOption[inx]"
              :treeOption="treeOption[inx]"
            >
              <span v-if="columns.length>0 && inx==(columns[0].type=='index'?1:0)">
                <Icon name = "play_fill" :class="iconClass(row._index)" v-if="row.children && row.children.length!=0" @on-click="toggleExpand(row._index,$event)"></Icon>
                <Checkbox v-if="isCheckbox" :value="row.checked" :indeterminate="row.indeterminate" @on-click="changeSelect(row,$event)"></Checkbox> 
              </span>
            </Cell>
          </td>
        </table-tr>
        <collapse-transition>
          <Tree-table
            v-if="objData[row._index]._isExpanded && row.children && row.children.length!=0"
            :styleObject = "styleObject"
            :parent="parent"
            :indent = "Number(1)"
            :data="row.children"
            :prefix-cls="prefixCls"
            :typeName = "typeName"
            :columns = "columns"
            :columnsWidth="columnsWidth"
            :showEditInput="showEditInput"
            :option="selectOption[index]"
            :treeOption="treeOption[index]"
            :isCheckbox="isCheckbox">
          </Tree-table>
        </collapse-transition>
      </template>
    </tbody>
  </table>
</template>
<script>
    // todo :key="row"
    import TableTr from './Table-tr.vue';
    import GroupTr from './Group-tr.vue';
    import TreeTable from './Tree-table.vue';
    import Cell from './Cell.vue';
    import Expand from './expand.js';
    import Mixin from './mixin';
    import Icon from '../Icon/Icon.vue'
    import CollapseTransition from '../Notice/collapse-transition';
    export default {
      name: 'GirdBody',
      mixins: [ Mixin ],
      components: { Cell, Expand, TableTr,GroupTr, TreeTable,Icon,CollapseTransition},
      props: {
        prefixCls: String,
        styleObject: Object,
        typeName: String,
        columns: Array,
        data: Array,    // rebuildData
        objData: Object,
        columnsWidth: Object,
        rowSelect: Boolean,
        fixed: {
          type: [Boolean, String],
          default: false
        },
        showEditInput:Boolean,
        isCheckbox:Boolean,
        checkStrictly:Boolean,
        option:Array,
        treeOption:Array,
      },
      data(){
        return{
          treeData:[],
          parent:this.$parent,
          flatState:[],
          selectOption: this.option
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
          if (this.typeName=="groupTable" && String(_index).indexOf('.')!=-1) {
            let k = String(_index).split('.')[0];
            let m = Number(String(_index).split('.')[1])-1;
            return this.objData[k].item[m] && this.objData[k].item[m]._isChecked;
          }else{
            return this.objData[_index] && this.objData[_index]._isChecked;
          }
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
            // this.objData[_index]._isChecked=!this.objData[_index]._isChecked;
            this.$parent.toggleSelect(_index);
          }
        },
        toggleExpand (index,e) {
          e.stopPropagation(); 
          this.$parent.toggleExpand(index);
        },
        compileFlatState () { // so we have always a relation parent/children of each node
          let keyCounter = 0;
          const flatTree = [];
          function flattenChildren(node, parent) {
              node.nodeKey = keyCounter++;
              flatTree[node.nodeKey] = { node: node, nodeKey: node.nodeKey };
              if (typeof parent != 'undefined') {
                  flatTree[node.nodeKey].parent = parent.nodeKey;
                  flatTree[parent.nodeKey].children.push(node.nodeKey);
              }

              if (node.children) {
                  flatTree[node.nodeKey].children = [];
                  node.children.forEach(child => flattenChildren(child, node));
              }
          }
          if (this.treeData && this.treeData.length > 0) {
            this.treeData.forEach(rootNode => {
              flattenChildren(rootNode);
            });
          }
          return flatTree;
        },
        updateCheckUp(_index){
          const parentKey = this.flatState[_index].parent;
          if (typeof parentKey == 'undefined') return;

          const node = this.flatState[_index].node;
          const parent = this.flatState[parentKey].node;
          if (node.checked == parent.checked && node.indeterminate == parent.indeterminate) return; // no need to update upwards
          if (node.checked == true) {
            let curStatus = parent.children.every(node => node.checked)
            this.$set(parent, 'checked', curStatus);
            this.$parent.objData[parent._index]._isChecked = curStatus;
            this.$set(parent, 'indeterminate', !parent.checked&&!this.showIndeterminate);
          } else {
            this.$set(parent, 'checked', false);
            this.$parent.objData[parent._index]._isChecked = false;
            this.$set(parent, 'indeterminate', parent.children.some(node => node.checked || node.indeterminate));
          }
          this.updateCheckUp(parentKey);
        },
        changeSelect (row,e) {
          let selectInx=[];
          e.stopPropagation(); 
          let status = !row.checked;
          const node = this.flatState[row._index].node;
          this.$set(node, 'checked', status);
          this.$parent.objData[node._index]._isChecked = status;
          this.$set(node, 'indeterminate', false);
          if (!this.checkStrictly) {
            this.updateCheckUp(row._index)
            this.updateCheckDown(node,{checked:status, indeterminate: false});
          }
          this.$parent.selectChange();
        },
        updateCheckDown(node,changes = {}){
          for (let key in changes) {
            this.$set(node, key, changes[key]);
          }
          this.$parent.objData[node._index]._isChecked =changes['checked'];
          if (node.children && node.children.length>0 && !this.checkStrictly) {
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
        }
      },
      mounted(){
        if (this.typeName == 'treeGird') {
          this.treeData = this.data;
          this.flatState = this.compileFlatState();
        }
      },
      watch:{
        data(){
          if (this.typeName == 'treeGird') {
            this.treeData = this.data;
            this.flatState = this.compileFlatState();
          }
        },
        option:{
          handler (val) {
            this.selectOption = val
          },
          deep: true
        }
      }
    };
</script>
