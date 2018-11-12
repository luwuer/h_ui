<template>
  <div :class="wrapClasses" :style="styles" ref="tableWrap">
    <div :class="classes">
      <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" @mousewheel="handleMouseWheel">
        <table cellspacing="0" cellpadding="0" border="0" :style="headStyles" ref="thead">
          <colgroup>
            <col v-for="(column, index) in cloneColumns" :width="setCellWidth(column, index, true)" :key="index">
          </colgroup>
          <thead>
            <tr v-if="multiLevel" v-for="(colItem,inx) in multiData" :key="inx">
              <th v-for="(multi, index) in colItem" :colspan="multi.cols||1" :key="index" :class="aliCls(multi)">
                <div :class="[prefixCls+'-cell']">
                  <span>{{multi.title}}</span>
                </div>
              </th>
            </tr>
            <tr class="cur-th">
              <th v-for="(column, index) in cloneColumns"
                :key="index"
                v-on:mousedown="mousedown($event,column,index)" 
                v-on:mouseout="mouseout($event,column,index)" 
                v-on:mousemove="mousemove($event,column,index)"
                :class="alignCls(column)" 
                >
                <table-cell
                  :column="column"
                  :index = "index"
                  :checked = "isSelectAll"
                  :prefixCls="prefixCls"
                >
                </table-cell>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div ref="body" :class="[prefixCls + '-body'] " class="h-simple-view" :style="bodyStyle" @scroll="handleBodyScroll"
        v-show="!((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">
        <!-- <div :class="[prefixCls + '-phantom']" :style="{height: contentHeight}">
        </div> -->
        <div class="h-simple-content"  ref="content">
          <table cellspacing="0" cellpadding="0" border="0" :style="tableStyle" ref="tbody">
            <colgroup>
              <col v-for="(column, index) in cloneColumns" :width="setCellWidth(column, index, false)" :key="index">
            </colgroup>
            <tbody :class="[prefixCls + '-tbody']">
              <template v-for="(row,index) in visibleData" >
                <table-tr
                  :row="row"
                  :key="row._rowKey"
                  :prefix-cls="prefixCls"
                  @mouseenter.native.stop="handleMouseIn(row._index)"
                  @mouseleave.native.stop="handleMouseOut(row._index)"
                  @click.native="clickCurrentRowTr($event,row._index)"
                  @dblclick.native.stop="dblclickCurrentRowTr(row._index)"
                >
                  <td v-for="column in cloneColumns" :class="alignCls(column, row)" :key="column._index">
                    <Cell
                      :prefix-cls="prefixCls"
                      :row="row"
                      :key="column._columnKey"
                      :column="column"
                      :index="row._index"
                      :checked="rowChecked(row._index)"
                      :disabled="rowDisabled(row._index)"
                    ></Cell>
                  </td>                  
                </table-tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div :class="[prefixCls + '-tip'] "
        v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))" @scroll="handleBodyScroll" :style="bodyStyle">
        <div :class="[prefixCls+'-tiptext']" :style="textStyle" >
          <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
          <span v-html="localeNoFilteredDataText" v-else></span>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
          <tbody>
            <tr>
              <td :style="{ 'height': bodyStyle.height}">
               <!--  <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
                <span v-html="localeNoFilteredDataText" v-else></span> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" ref="leftF">
        <div :class="fixedHeaderClasses">
          <table cellspacing="0" cellpadding="0" border="0" :style="headStyles" ref="leftF">
            <colgroup>
              <col v-for="(column, index) in leftFixedColumns" :width="setCellWidth(column, index, true)" :key="index">
            </colgroup>
            <thead>
              <tr>
                <th v-for="(column, index) in leftFixedColumns"
                  :key="index"
                  v-on:mousedown="mousedown($event,column,index)" 
                  v-on:mouseout="mouseout($event,column,index)" 
                  v-on:mousemove="mousemove($event,column,index)"
                  :class="alignCls(column,{},'left')" 
                  >
                  <table-cell
                    :column="column"
                    :index = "index"
                    :checked = "isSelectAll"
                    :prefixCls="prefixCls"
                  >
                  </table-cell>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div :class="[prefixCls + '-fixed-body']" class="h-simple-view" :style="fixedBodyStyle" ref="fixedBody">
           <div :class="[prefixCls + '-phantom']" :style="{height: contentHeight}">
        </div>
        <div class="h-simple-content" ref="leftContent">
          <table cellspacing="0" cellpadding="0" border="0" :style="tableStyle" ref="tbody">
            <colgroup>
              <col v-for="(column, index) in cloneColumns" :width="setCellWidth(column, index, false)" :key="index">
            </colgroup>
            <tbody :class="[prefixCls + '-tbody']">
              <template v-for="(row,index) in visibleData" >
                <table-tr
                  :row="row"
                  :key="row._rowKey"
                  :prefix-cls="prefixCls"
                  @mouseenter.native.stop="handleMouseIn(row._index)"
                  @mouseleave.native.stop="handleMouseOut(row._index)"
                  @click.native="clickCurrentRowTr($event,row._index)"
                  @dblclick.native.stop="dblclickCurrentRowTr(row._index)"
                >
                  <td v-for="column in cloneColumns" :class="alignCls(column, row,'left')" :key="column._index">
                    <Cell
                      fixed="left"
                      :prefix-cls="prefixCls"
                      :row="row"
                      :key="column._columnKey"
                      :column="column"
                      :index="row._index"
                      :checked="rowChecked(row._index)"
                      :disabled="rowDisabled(row._index)"
                    ></Cell>
                  </td>                  
                </table-tr>
                <!-- <tr
                  :class="rowClasses(row._index)"
                  :key="row._rowKey"
                  @mouseenter="handleMouseIn(row._index)"
                  @mouseleave.native.stop="handleMouseOut(row._index)"
                  @click.native.stop="clickCurrentRowTr($event,row._index)"
                  @dblclick.native.stop="dblclickCurrentRowTr(row._index)">
                  <td v-for="column in cloneColumns" :class="alignCls(column, row,'left')" :key="column._index">
                    <div :class="classesTd(column)">
                      <template v-if="column.type === 'index'">{{row._index}}</template>
                      <template v-if="column.type === 'selection'">
                        <Checkbox size="large" :value="rowChecked(row._index)" @click.native.stop="handleClickTr($event,row._index,rowChecked(row._index))" @on-change="toggleSelect(row._index)" :disabled="rowDisabled(row._index)"></Checkbox>
                      </template>
                      <template v-if="!column.type&&!column.render"><span v-html="row[column.key]"></span></template>
                      <Cell
                        v-if="column.render"
                        :row="row"
                        :column="column"
                        :index="row._index"
                        :render="column.render"></Cell>
                    </div>
                  </td>
                </tr> -->
              </template>
            </tbody>
          </table>
        </div>
        </div>
      </div>
      <div class="h-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"> </div>
    </div>
    <Spin fix size="large" v-if="loading">
      <slot name="loading">
        <h-icon name="load-c" size=18 class='h-load-loop'></h-icon>
        <div v-html="loadingText"></div>
      </slot>
    </Spin>
  </div>
</template>
<script>

import renderHeader from './header';
import Spin from '../Spin/Spin.vue';
import { oneOf, getStyle, deepCopy, getScrollBarSize,findInx,getBarBottom,hasClass,addClass,removeClass,typeOf} from '../../util/tools';
import { on, off } from '../../util/dom';
import Locale from '../../mixins/locale';
import Mixin from './mixin';
import Csv from '../../util/csv';
import ExportCsv from '../Table/export-csv.js';
import TableTr from './Table-tr.vue'
import TableCell from './Table-cell.vue'
import Cell from './Cell.vue'
import Checkbox from '../Checkbox/Checkbox.vue';

const prefixCls = 'h-table';

let rowKey = 1;
let columnKey = 1;

export default {
  name: 'Table',
  mixins: [ Locale,Mixin],
  components: {Cell,Checkbox,renderHeader,TableTr,Cell,TableCell},
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default']);
      }
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String],
      default:400,
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return '';
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    canDrag:{
      type:Boolean,
      default:true
    },
    canMove:{
      type:Boolean,
      default:false
    },
    rowSelect:{
      type:Boolean,//多选时是否支持点击行选中
      default:false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasWidth:{
      type:[String,Number],
    },
    headAlgin:{
      validator (value) {
        return oneOf(value, ['left', 'center', 'right']);
      },
      default:'left'
    },
    bodyAlgin:{
      validator (value) {
        return oneOf(value, ['left', 'center', 'right']);
      },
      default:'left'
    },
    selectOption:{
      type:Boolean,
      default:false,
    },
    showTitle:{
      type:Boolean,
      default:false,
    },
    itemHeight: {
      type: Number,
      default:40
    },
    notSort:{
      type:Boolean,
      default:false,
    },
    multiLevel:{
      type:Array,
      default:null
    },
  },
  data () {
    return {
      ready: false,
      tableWidth: 0,
      dragWidth: 0,
      initWidth:0,
      columnsWidth: {},
      prefixCls: prefixCls,
      compiledUids: [],
      objData: this.makeObjData(),     // checkbox or highlight-row
      rebuildData: [],    // for sort or filter
      cloneColumns: this.makeColumns(),
      showSlotHeader: true,
      showSlotFooter: true,
      bodyHeight: 0,
      bodyRealHeight: 0,
      scrollBarWidth: getScrollBarSize(),
      currentContext: this.context,
      cloneData: deepCopy(this.data),    // when Cell has a button to delete row data, clickCurrentRow will throw an error, so clone a data
      resizeProxyVisible: false,
      showScroll:false,
      headerRealHeight:0,
      visibleCount:50,
      start:0,
      end:50,
      visibleData:[],
      allclick:false,
      buttomNum:null,
      topNum:null,
      shiftSelect:[],
      ctrlSelect:[],
      dragging:false,
      draggingColumn:false,
      loading1:false,
    };
  },
  computed: {
    multiData(){
      if (!this.multiLevel || this.multiLevel.length==0) return [];
      let data = [];
          data[0]=[];
      this.multiLevel.forEach((cols,i)=>{
        if(typeOf(cols)!='array'){
          if(!cols.hiddenCol&&cols.hiddenCol!='false'){
            data[0].push(cols);
          }
        }else{
          let data2=[]
          cols.forEach((item,inx)=>{
            if(!item.hiddenCol&&item.hiddenCol!='false'){
              data2.push(item);
            }
          })
          data.push(data2);
        }
      })
      return data.length>0?data:[];
    },
    headStyles () {//深拷贝
      const style = Object.assign({}, this.tableStyle);
      const width = this.bodyHeight === 0 ? parseInt(this.tableStyle.width) : parseInt(this.tableStyle.width) + this.scrollBarWidth;
      style.width = `${width}px`;
      return style;
    },
    isSelectAll () {
      let isSelectAll = true;
      if (!this.visibleData.length) isSelectAll = false;
      for (let i = 0; i < this.visibleData.length; i++) {
        if (!this.objData[this.visibleData[i]._index]._isChecked && !this.objData[this.visibleData[i]._index]._isDisabled) {
          isSelectAll = false;
          break;
        }
      }
      if (isSelectAll&&!this.allclick) {
        this.allclick = false;
        for (let i = 0; i < this.rebuildData.length; i++) {
          if (!this.objData[this.rebuildData[i]._index]._isChecked && !this.objData[this.rebuildData[i]._index]._isDisabled) {
            isSelectAll = false;
            break;
          }
        } 
        return isSelectAll;      
      }else{
        return isSelectAll;
      }
    },
    loadingText(){
      return this.t('i.table.loadingText');
    },
    localeNoDataText () {
      if (this.noDataText === undefined) {
        return this.t('i.table.noDataText');
      } else {
        return this.noDataText;
      }
    },
    localeNoFilteredDataText () {
      if (this.noFilteredDataText === undefined) {
        return this.t('i.table.noFilteredDataText');
      } else {
        return this.noFilteredDataText;
      }
    },
    wrapClasses () {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
          [`${prefixCls}-with-footer`]: this.showSlotFooter
        }
      ];
    },
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-border`]: this.border,
          [`${prefixCls}-stripe`]: this.stripe,
          [`${prefixCls}-with-fixed-top`]: !!this.height
        }
      ];
    },
    fixedHeaderClasses () {
      return [
        `${prefixCls}-fixed-header`,
        {
          [`${prefixCls}-fixed-header-with-empty`]: !this.rebuildData.length
        }
      ];
    },
    styles () {
      let style = {};
      if (this.height) {
        let height = Number(this.height)+2
        style.height = `${height}px`;
      }
      if (this.width) style.width = `${this.width}px`;
      return style;
    },
    tableStyle () {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = '';
        if (this.bodyHeight === 0) {
          width = this.tableWidth;
        } else {
          if (this.bodyHeight > this.bodyRealHeight) {
            width = this.tableWidth;
          } else {
            width = this.tableWidth - this.scrollBarWidth;
          }
        }
        style.width = `${width}px`;
      }
      return style;
    },
    fixedTableStyle () {
      let style = {};
      let width = 0;
      this.leftFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === 'left') width += col._width;
      });
      style.width = `${width}px`;
      return style;
    },
    fixedRightTableStyle () {
      let style = {};
      let width = 0;
      this.rightFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === 'right') width += col._width;
      });
      if (!!this.height && this.height < this.bodyRealHeight) {
        style.marginRight = `${this.scrollBarWidth}px`;
        this.showScroll = true;
      }else{
        width = width==0?0:width+this.scrollBarWidth;
      }
      style.width = `${width}px`;

      return style;
    },
    fixedRightPatchStyle(){
      let style = {};
      let width = this.scrollBarWidth;
      let height = this.headerRealHeight;
      let top = parseInt(getStyle(this.$refs.title, 'height')) || 0;
      style.width = `${width}px`;
      style.height = `${height}px`;
      style.top = `${top}px`;
      return style;
    },
    bodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0) {
        style.height = `${this.bodyHeight}px`;
      }
      return style;
    },
    fixedBodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0) {
        let height = this.bodyHeight-this.scrollBarWidth;
        if (this.tableWidth < this.initWidth+1) {
          height = this.bodyHeight + this.scrollBarWidth-1;
        }
        style.height = `${height}px`;
      }
      return style;
    },
    textStyle(){
      let style = {};
      // style.width = this.initWidth!=0?this.initWidth+'px': this.hasWidth ? this.hasWidth+'px' : '100%';
      style.width = this.initWidth!=0?this.initWidth+'px':'100%';
      const height = this.bodyHeight;
      style.height = this.height?Number(height-this.scrollBarWidth)+'px':null;
      style.lineHeight = this.height?Number(height-this.scrollBarWidth)+'px':null;
      return style;
    },
    leftFixedColumns () {
        let left = [];
        let other = [];
        this.cloneColumns.forEach((col) => {
            if (col.fixed && col.fixed === 'left') {
                left.push(col);
            } else {
                other.push(col);
            }
        });
        return left.concat(other);
    },
    isLeftFixed () {
        return this.columns.some(col => col.fixed && col.fixed === 'left');
    },
    isRightFixed () {
        return this.columns.some(col => col.fixed && col.fixed === 'right');
    },
    contentHeight() {
      return this.rebuildData.length * this.itemHeight + 'px';
    }
  },
  methods: {
    cellClasses (column) {
      return [
        `${this.prefixCls}-cell`,
      ];
    },
    aliCls(item){
      return[
        {
          [`${item.className}`]: item.className,
          [`${this.prefixCls}-column-${item.align}`]: item.align,
        }
      ]
    },
    rowClsName (index) {
      return this.rowClassName(this.data[index], index);
    },
    classesTd (column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-cell-ellipsis`]: column.ellipsis || false,
        }
      ];
    },
    rowChecked (_index) {
      // return true;
      return this.objData[_index]._isChecked;
    },
    rowDisabled(_index){
      return this.objData[_index]._isDisabled;
    },
    changeWidth(width,key,lastWidth){
      var that = this;
      var lastInx = this.cloneColumns.length-1;
      var totalWidth=0;
      this.cloneColumns.forEach((col,i)=>{
        if (col.key==key) {
          that.$set(col,"width",width);
          that.$set(col,"_width",width);
        }
        if (i == lastInx && this.cloneColumns[lastInx].fixed!='right') {
          that.$set(col,"width",lastWidth);
          that.$set(col,"_width",lastWidth);
        }
        var colWidth = col.width||col._width
        totalWidth = totalWidth+ colWidth;
      });
      if (this.bodyHeight !== 0) {
        totalWidth = totalWidth + this.scrollBarWidth;
      }
      this.tableWidth=totalWidth+1;
      if (this.cloneColumns[lastInx].fixed!='right' && this.tableWidth<this.initWidth) {
        this.tableWidth = this.initWidth-1;
      }
      this.$emit('on-drag', width, key);
    },
    mousedown(event,column,index){
      if (this.$isServer || !this.canDrag || !this.draggingColumn) return;
      if (!column) return;
      let _this = this;
        this.dragging = true;      
        this.resizeProxyVisible = true;
        const table = this; 
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el.querySelector(`th.h-ui-${column.key}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;
        let lastWidth =this.findObj(event,"TR").lastChild.offsetWidth;
        let tableWidth = this.$el.parentElement.offsetWidth-1;
        let headWidth = this.$el.offsetWidth;
        addClass(columnEl, 'noclick');

        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };

        const resizeProxy = this.$refs.resizeProxy;
        resizeProxy.style.left = this.dragState.startLeft + 'px';

        document.onselectstart = function() { return false; };
        document.ondragstart = function() { return false; };
        
        const handleMouseMove = (event) => {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft;
          const proxyLeft = this.dragState.startLeft + deltaLeft;

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
        };

        const handleMouseUp = () => {
          if (_this.dragging) {
            const {
              startColumnLeft,
              startLeft
            } = _this.dragState;
            const finalLeft = parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            let dragWidth = finalLeft - startLeft;//>0为输入框增大，<0为减小
            if (dragWidth>=0) {
              lastWidth = (lastWidth-dragWidth)>=80?(lastWidth-dragWidth):80;
            }else{
              if (headWidth+1>=tableWidth) {//此时有滚动条
                if (headWidth+1+dragWidth<=tableWidth) {
                  lastWidth =lastWidth+tableWidth-headWidth-dragWidth;
                }
              }else{
                lastWidth = lastWidth-dragWidth;
              }
            }
            if (table.bodyHeight !== 0) {
              lastWidth = lastWidth - getScrollBarSize();
            }
            _this.changeWidth(columnWidth, column.key,lastWidth);

            document.body.style.cursor = '';
            _this.dragging = false;
             _this.draggingColumn = false;
            _this.dragState = {};

            table.resizeProxyVisible = false;
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;

          setTimeout(function() {
            removeClass(columnEl, 'noclick');
          }, 0);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    },
    mousemove(event,column,index){
      if (!this.canDrag) return;
      if (!column ) return;
      if (column.children && column.children.length > 0) return;
      let target = this.findObj(event,"TH");
      if(this.canDrag){
        // moveDrag需传入event win7下FF60版本不可拖拽
        this.moveDrag(event, target,column);
      }
    },
    moveDrag(event, target,column){
      if (!this.dragging) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize';
          this.draggingColumn = true;
        } else if (!this.dragging) {
          bodyStyle.cursor = '';
          this.draggingColumn = false;
        }
      }
    },
    mouseout() {
      if (this.$isServer) return;
      document.body.style.cursor = '';
    },
    findObj(e,name){
      var obj=e.target;
      while(obj&&obj.tagName!=name){
        obj=obj.parentElement
      }
      return obj;      
    },
    handleResize () {
      this.$nextTick(() => {
        const allWidth = !this.columns.some(cell => !cell.width&&cell.width!==0);    // each column set a width
        if (allWidth) {
          this.tableWidth = this.columns.map(cell => cell.width).reduce((a, b) => a + b);
        } else {
          this.tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
          if (!this.tableWidth&&this.hasWidth) {
            this.tableWidth = this.hasWidth-1;
          }
        }
        this.columnsWidth = {};
        this.$nextTick(() => {
          let columnsWidth = {};
          let autoWidthIndex = -1;
          // if (allWidth) autoWidthIndex = this.cloneColumns.findIndex(cell => !cell.width);//todo 这行可能有问题
          if (allWidth) autoWidthIndex = findInx(this.cloneColumns,cell => !cell.width);
          if (this.data.length) {
            const $td = this.$refs.tbody.querySelectorAll('tbody tr')[0].querySelectorAll('td');
            for (let i = 0; i < $td.length; i++) {    // can not use forEach in Firefox
              const column = this.cloneColumns[i];
              let width = parseInt(getStyle($td[i], 'width'));
              if (i === autoWidthIndex) {
                  width = parseInt(getStyle($td[i], 'width')) - 1;
              }
             // if (column.width) width = column.width||'';
             // 自适应列在表格宽度较小时显示异常，为自适应列设置最小宽度100（拖拽后除外）
              if (column.width) {
                  width = column.width||'';
              } else {
                  if (width < 100) width = 100;
              }
              this.cloneColumns[i]._width = width||'';
              // this.cloneColumns[i].leftWidth = $td[i].getBoundingClientRect().left||'';
              this.tableWidth = this.cloneColumns.map(cell => cell.width).reduce((a, b) => a + b);

              columnsWidth[column._index] = {
                  width: width
              };
            }
            this.columnsWidth = columnsWidth;
          }else{
            if (!this.$refs.thead) return;
            const $th = this.$refs.thead.querySelectorAll('thead .cur-th')[0].querySelectorAll('th');
            for (let i = 0; i < $th.length; i++) {    // can not use forEach in Firefox
              const column = this.cloneColumns[i]; 
              let width = parseInt(getStyle($th[i], 'width'));
              if (i === autoWidthIndex) {
                width = parseInt(getStyle($th[i], 'width')) - 1;
              }
             // 自适应列在表格宽度较小时显示异常，为自适应列设置最小宽度100（拖拽后除外）
              if (column.width) {
                  width = column.width||'';
              } else {
                  if (width < 100) width = 100;
              }
              this.cloneColumns[i]._width = width||'';
              this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b);
              columnsWidth[column._index] = {
                  width: width
              };
            }
            this.columnsWidth = columnsWidth;
          }

        });
        // get table real height,for fixed when set height prop,but height < table's height,show scrollBarWidth
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'))||0;
        this.headerRealHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
      });
    },
    getshiftSelect(_index){
      switch(this.shiftSelect.length){
        case 0:
          this.shiftSelect[0]=_index;
          break;
        case 1:
          let min=Math.min(this.shiftSelect[0],_index);
          let max = Math.max(this.shiftSelect[0],_index);
          this.$set(this.shiftSelect,0,min);
          this.$set(this.shiftSelect,1,max);
          // this.shiftSelect[0] = min;
          break;
        case 2:
          if (_index<this.shiftSelect[0]) this.$set(this.shiftSelect,0,_index);
          if (_index>this.shiftSelect[1]) this.$set(this.shiftSelect,1,_index);
          break;
        default:
          this.shiftSelect=[];
      }
    },
    getctrlSelect(_index){
      let itemIndex = this.ctrlSelect.indexOf(_index)
      if (itemIndex==-1) {
        this.ctrlSelect.push(_index);
        this.objData[_index]._isChecked = true;
      }else{
        this.ctrlSelect.splice(itemIndex,1);
        this.objData[_index]._isHighlight = false;
        this.objData[_index]._isChecked = false;
      }
      this.$emit('on-selection-change', this.getSelection(),this.getSelection(true));
    },
    handleClick(){
    },
    handleClickTr (event,rowIndex,status) {
      if (event.shiftKey&&rowIndex) {
        this.getshiftSelect(rowIndex);
      }else if(!status){
        this.shiftSelect=[]
        this.shiftSelect[0] = rowIndex;
      }else{
        this.shiftSelect=[]
      }
    },
    handleMouseIn (_index) {
        if (this.disabledHover) return;
        if (this.objData[_index]._isHover) return;
        this.objData[_index]._isHover = true;
    },
    handleMouseOut (_index) {
        if (this.disabledHover) return;
        this.objData[_index]._isHover = false;
    },
    highlightCurrentRow (_index) {
        if (!this.highlightRow) return;
        const curStatus = this.objData[_index]._isHighlight;
        let oldIndex = -1;
        for (let i in this.objData) {
          this.objData[i]._isChecked = false;//单选时取消多选项，估值6.0专用
            if (this.objData[i]._isHighlight) {
              oldIndex = parseInt(i);
              this.objData[i]._isHighlight = false;//单选是上一项取消选中
            }
        }
        const oldData = oldIndex < 0 ? null : JSON.parse(JSON.stringify(this.cloneData[oldIndex]));
        if (curStatus && !this.selectOption) {
          this.objData[_index]._isHighlight = false;
          this.objData[_index]._isChecked = false;
          // this.$emit('on-current-change-cancle',JSON.parse(JSON.stringify(this.cloneData[_index])), oldData);
          this.$emit('on-current-change', null,null);
        }else{
          this.objData[_index]._isHighlight = true;
          this.objData[_index]._isChecked = true;
          // this.$emit('on-current-change', JSON.parse(JSON.stringify(this.cloneData[_index])), oldData);
          this.$emit('on-current-change', JSON.parse(JSON.stringify(this.cloneData[_index])),_index);
        }
        // if (this.columns[0].type=='selection' || this.columns[1].type=='selection') {
          this.$emit('on-selection-change',this.getSelection(),this.getSelection(true));
        // }
    },
    clickCurrentRowTr (event,_index) {       
      if (!event.shiftKey && !event.ctrlKey) {
        if(this.rowSelect){
          // this.objData[_index]._isChecked=!this.objData[_index]._isChecked;
          this.toggleSelect(_index);
        }else{
          this.clickCurrentRow(_index);
        }
        if (this.objData[_index]._isHighlight) {
          this.shiftSelect = [];
          this.ctrlSelect = [];
          this.shiftSelect[0]=_index
          this.ctrlSelect.push(_index);
        }else{
          this.shiftSelect= [];
          this.ctrlSelect = [];
        }
      }else if(event.shiftKey){
        window.getSelection()?window.getSelection().removeAllRanges():document.selection.empty();
        this.getshiftSelect(_index);  
      }else{
        this.getctrlSelect(_index);
      }
    },
    dblclickCurrentRowTr (_index) {
      if (!this.rowSelect) {
        this.dblclickCurrentRow(_index);
      }
    },
    clickCurrentRow (_index) {
      if (!this.rowSelect) {
        this.highlightCurrentRow (_index);
      }
      this.$emit('on-row-click', [JSON.parse(JSON.stringify(this.cloneData[_index])),_index]);
    },
    dblclickCurrentRow (_index) {
      if (!this.rowSelect) {
        this.highlightCurrentRow (_index);
      }
      this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(this.cloneData[_index])));
    },
    getSelection (status=false) {
      let selectionIndexes = [];
      for (let i in this.objData) {
          if (this.objData[i]._isChecked) selectionIndexes.push(parseInt(i));
      }
      return status?selectionIndexes:JSON.parse(JSON.stringify(this.data.filter((data, index) => selectionIndexes.indexOf(index) > -1)));
    },
    toggleSelect (_index) {
      this.allclick = false;
      let data = {};
      for (let i in this.objData) {
        if (parseInt(i) === _index) {
          data = this.objData[i];
        }
      }
      const status = !data._isChecked;
      this.objData[_index]._isChecked = status;
      if (!status) {
        this.objData[_index]._isHighlight = false;
      }

      const selection = this.getSelection();
      this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(this.data[_index])));
      this.$emit('on-selection-change', selection,this.getSelection(true));
    },
    clearAllRow(){
      for (let i in this.objData) {
          if (this.objData[i]._isHighlight) {
            this.objData[i]._isHighlight = false;
          }
      }
    },
    toggleMached(arr){
      for (let i in this.objData) {
        this.objData[i]._isMatched = false;//取消所有匹配项，估值6.0专用
      }
      if (arr.length == 0) return false;
      arr.map(inx=>{this.objData[inx]._isMatched = true;});
    },
    itemSelect(i,status){
      if (!this.rebuildData[i]) return;
      let index = this.rebuildData[i]._index;
      this.objData[index]._isHighlight=false;
      if(!this.objData[index]._isDisabled){
        this.objData[index]._isChecked = status;
      }
    },
    selectAll (status) {
      this.allclick=true;
      for(const data of this.visibleData){
        this.objData[data._index]._isHighlight=false;
        if(this.objData[data._index]._isDisabled){
          continue;
        }else{
          this.objData[data._index]._isChecked = status;
        }
      }
      setTimeout(()=>{
        for(const data of this.rebuildData){
          this.objData[data._index]._isHighlight=false;
          if(this.objData[data._index]._isDisabled){
            continue;
          }else{
           this.objData[data._index]._isChecked = status;
          }
        }
        const selection = this.getSelection();
        this.$emit('on-select-all', selection);
        this.$emit('on-selection-change', selection,this.getSelection(true));
      }, 0);
    },
    handleSort (index, type) {
      if (this.cloneColumns[index]._sortType === type) {
          type = 'normal';
      }
      let _index = this.cloneColumns[index]._index;
      this.handleSortT(_index, type);
    },
    handleSortByHead (index) {
      const column = this.cloneColumns[index];
      if (column.sortable) {
        const type = column._sortType;
        if (type === 'normal') {
            this.handleSort(index, 'asc');
        } else if (type === 'asc') {
            this.handleSort(index, 'desc');
        } else {
            this.handleSort(index, 'normal');
        }
      }
    },
    sortData (data, type, index) {
        const key = this.cloneColumns[index].key;
        data.sort((a, b) => {
            if (this.cloneColumns[index].sortMethod) {
                return this.cloneColumns[index].sortMethod(a[key], b[key], type);
            } else {
                if (type === 'asc') {
                    return a[key] > b[key] ? 1 : -1;
                } else if (type === 'desc') {
                    return a[key] < b[key] ? 1 : -1;
                }
            }
        });
        return data;
    },
    handleSortT (_index, type) {
      let index;
      this.cloneColumns.forEach((col,i) => {
        col._sortType = 'normal'
        if (col._index == _index) {
          index = i;
        }
      });//rightFixed index error
      const key = this.cloneColumns[index].key;
      if (this.cloneColumns[index].sortable !== 'custom') {    // custom is for remote sort
          if (type === 'normal') {
              this.rebuildData = this.makeDataWithFilter();
          } else {
              this.rebuildData = this.sortData(this.rebuildData, type, index);
          }
      }
      this.cloneColumns[index]._sortType = type;

      this.$emit('on-sort-change', {
          column: JSON.parse(JSON.stringify(this.columns[this.cloneColumns[index]._index])),
          key: key,
          order: type
      });
      this.$nextTick(()=>{
        this.updateVisibleData();
      })
    },
    makeDataWithFilter () {
      let data = this.makeData();
      // this.cloneColumns.forEach(col => data = this.filterData(data, col));
      return data;
    },
    selectRange(){
      for (var i = this.shiftSelect[0]; i <= this.shiftSelect[1]; i++) {
        this.objData[i]._isHighlight=false;
        if(!this.objData[i]._isDisabled){
          this.objData[i]._isChecked = true;
        }
      }
      this.$emit('on-selection-change', this.getSelection(),this.getSelection(true));
    },
    fixedHeader () {
      if (this.height) {
        this.$nextTick(() => {
            const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0;
            if (titleHeight>0) {
              if(this.$refs.leftF)this.$refs.leftF.style.marginTop=titleHeight+'px';
              if(this.$refs.rightF)this.$refs.rightF.style.marginTop=titleHeight+'px';
            }
            // const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
            const headerHeight = this.headerRealHeight;
            const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0;
            this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight;
        });
      } else {
        this.bodyHeight = 0;
      }
    },
    handleBodyScroll (event) {
      if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
      if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
      if (this.isRightFixed) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
      this.buttomNum = getBarBottom(event.target,this.scrollBarWidth);
      this.topNum = event.target.scrollTop
      // this.$refs.content.style.transform = `translate3d(0, ${event.target.scrollTop}px, 0)`;
      // if(this.$refs.leftContent){
      //   this.$refs.leftContent.style.transform = `translate3d(0, ${event.target.scrollTop}px, 0)`;
      // }
      // setTimeout(()=>{this.updateVisibleData(event.target.scrollTop)},0);
    },
    // updateVisibleData(scrollTop) {
      // scrollTop = scrollTop || this.$refs.body.scrollTop;
      // this.start = Math.floor(scrollTop / this.itemHeight);
      // this.start = this.start>this.visibleCount?Number(this.start-this.visibleCount):0;
      // this.end = this.start + this.visibleCount;
      // this.visibleData = this.rebuildData.slice(this.start, this.end);
      // this.$refs.content.style.marginTop = `${ this.start * this.itemHeight }px`;
      // this.$refs.content.style.transform = `translate3d(0, ${ this.start * this.itemHeight }px, 0)`;
      // if(this.$refs.leftContent){
        // this.$refs.leftContent.style.marginTop = `${ this.start * this.itemHeight }px`;
        // this.$refs.leftContent.style.transform = `translate3d(0, ${ this.start * this.itemHeight }px, 0)`;
      // }
      // setTimeout(()=>{
      //   this.visibleData=this.rebuildData.slice(this.start, this.end+this.visibleCount);
      // },500)
    // },
    updateVisibleData(index){
      if(index&&index>0){
        this.$nextTick(()=>{
          this.$refs.body.scrollTop = this.$refs.body.scrollHeight/4;
          this.loading1 = false;
        })
      }
      index = index || 0;
      this.end = index + 2*this.visibleCount;
      this.visibleData = this.rebuildData.slice(index, this.end);
    },
    handleMouseWheel (event) {
      const deltaX = event.deltaX;
      const $body = this.$refs.body;
      if (deltaX > 0) {
        $body.scrollLeft = $body.scrollLeft + 10;
      } else {
        $body.scrollLeft = $body.scrollLeft - 10;
      }
    },
    getIndex(_index){
      let index;
      this.cloneColumns.forEach((col,i) => {
        if (col._index == _index) {
          index = i;
        }
      });
      return index;
    },//rightFixed index error
    makeData () {
        let data = deepCopy(this.data);
        data.forEach((row, index) => {
            row._index = index;
            row._rowKey = rowKey++;
        });
        return data;
    },
    makeDataWithSort () {
      let data = this.makeData();
      if(this.notSort){
        return data;
      }
      let sortType = 'normal';
      let sortIndex = -1;
      let isCustom = false;

      for (let i = 0; i < this.cloneColumns.length; i++) {
          if (this.cloneColumns[i]._sortType !== 'normal') {
              sortType = this.cloneColumns[i]._sortType;
              sortIndex = i;
              isCustom = this.cloneColumns[i].sortable === 'custom';
              break;
          }
      }
      if (sortType !== 'normal' && !isCustom) data =  this.sortData(data, sortType, sortIndex);
      return data;
    },
    makeDataWithSortAndFilter () {
      // let data = this.makeData();
      let data = this.makeDataWithSort();
      return data;
    },
    makeObjData () {
      let data = {};
      this.data.forEach((row, index) => {
        const newRow = deepCopy(row);// todo 直接替换
        newRow._isHover = false;
        if (newRow._disabled) {
            newRow._isDisabled = newRow._disabled;
        } else {
            newRow._isDisabled = false;
        }
        if (newRow._checked) {
            newRow._isChecked = newRow._checked;
        } else {
            newRow._isChecked = false;
        }
        if (newRow._expanded) {
            newRow._isExpanded = newRow._expanded;
        } else {
            newRow._isExpanded = false;
        }
        if (newRow._highlight) {
            newRow._isHighlight = newRow._highlight;
        } else {
            newRow._isHighlight = false;
        }
        if (newRow._isMatched) {
            newRow._isMatched = newRow._isMatched;
        } else {
            newRow._isMatched = false;
        }
        data[index] = newRow;
      });
      return data;
    },
    makeColumns () {
      var that = this;
      let columns = deepCopy(this.columns);
      let left = [];
      let right = [];
      let center = [];
      columns.forEach((column, index) => {
        column._index = index;
        column._columnKey = columnKey++;
        column._width = column.width ? column.width : '';    // update in handleResize()
        // if(!!column.hiddenCol){
        //   that.columns[index].width = 0;
        //   column.width = 0;
        //   column._width = 0;
        // }
        column._sortType = 'normal';
        column._filterVisible = false;
        column._isFiltered = false;
        column._filterChecked = [];

        if ('filterMultiple' in column) {
            column._filterMultiple = column.filterMultiple;
        } else {
            column._filterMultiple = true;
        }
        if ('filteredValue' in column) {
            column._filterChecked = column.filteredValue;
            column._isFiltered = true;
        }
        if ('sortType' in column) {
            column._sortType = column.sortType;
        }
        if (!column.hiddenCol || column.hiddenCol=='false') {
          if (column.fixed && column.fixed === 'left') {
              left.push(column);
          } else if (column.fixed && column.fixed === 'right') {
              right.push(column);
          } else {
              center.push(column);
          }
        }
      });
      return left.concat(center).concat(right);
    },
    rowClasses (_index) {
      return [
        `${this.prefixCls}-row`,
        this.rowClsName(_index),
        {
          [`${this.prefixCls}-row-checked`]: this.objData[_index] && this.objData[_index]._isChecked,
          [`${this.prefixCls}-row-highlight`]: this.objData[_index] && this.objData[_index]._isHighlight,
          [`${this.prefixCls}-row-hover`]: this.objData[_index] && this.objData[_index]._isHover
        }
      ];
    },
    rowClsName (_index) {
      return this.rowClassName(this.objData[_index], _index);
    },
    initResize(){
      this.$nextTick(() => {
        this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0; 
      });
    },
    exportCsv (params) {
      if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
            params.filename += '.csv';
        }
      } else {
        params.filename = 'simpleTable.csv';
      }
      let columns = [];
      let datas = [];
      if (params.columns && params.data) {
          columns = params.columns;
          datas = params.data;
      } else {
          columns = this.columns;
          if (!('original' in params)) params.original = true;
          datas = params.original ? this.data : this.rebuildData;
      }
      let noHeader = false;
      if ('noHeader' in params) noHeader = params.noHeader;
      const data = Csv(columns, datas, params, noHeader);
      ExportCsv.download(params.filename, data);
    },
  },
  created () {
      if (!this.context) this.currentContext = this.$parent;
      this.showSlotHeader = this.$slots.header !== undefined;
      this.showSlotFooter = this.$slots.footer !== undefined;
      this.rebuildData = this.makeDataWithSortAndFilter();
  },
  mounted () {
    this.handleResize();
    this.fixedHeader();
    this.$nextTick(() => {
      this.ready = true;
      this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0;
      this.visibleCount = Math.ceil(this.height / this.itemHeight); 
      this.updateVisibleData();
    });
    //window.addEventListener('resize', this.handleResize, false);
    on(window, 'resize', this.handleResize);
    on(window, 'resize', this.initResize);
    this.$on('on-visible-change', (val) => {
      if (val) {
        this.handleResize();
        this.fixedHeader();
      }
    });
  },
  beforeDestroy () {
      //window.removeEventListener('resize', this.handleResize, false);
      off(window, 'resize', this.handleResize);
      off(window, 'resize', this.initResize);
  },
  watch: {
      data: {
        handler () {
          const oldDataLen = this.rebuildData.length;
          this.objData = this.makeObjData();
          this.rebuildData = this.makeDataWithSortAndFilter();
          if (!oldDataLen) {
            this.fixedHeader();
          }
          this.updateVisibleData();
          this.handleResize();
          // here will trigger before clickCurrentRow, so use async
          setTimeout(() => {
            this.cloneData = deepCopy(this.data);
            this.buttomNum = null;
            this.topNum = null;
          }, 0);
        },
        deep: true
      },
      columns: {
        handler () {
          // todo 这里有性能问题，可能是左右固定计算属性影响的
          this.cloneColumns = this.makeColumns();
          this.rebuildData = this.makeDataWithSortAndFilter();
          this.handleResize();
          this.buttomNum = null;
          this.topNum = null;
          this.$nextTick(()=>{
            this.updateVisibleData();
          });
        },
        deep: true
      },
      height () {
          this.fixedHeader();
      },
      hasWidth(){
        this.handleResize();
      },
      buttomNum(val,oldvalue){
        if(val==null || oldvalue == null) return;
        if(val == 0){
          let curIndex = this.visibleData[0]._index||0
          let index = curIndex+2*this.visibleCount;
          if(index<this.rebuildData.length&&!this.loading1){
            this.loading1 = true;
            this.updateVisibleData(curIndex+this.visibleCount);
          }
        }
        this.$emit('on-scroll',this.buttomNum);
      },
      topNum(val,oldvalue){
        if(val == 0){
          let curIndex = this.visibleData[0]._index||0
          let index = curIndex-this.visibleCount;
          if(index>=0&&!this.loading1){
            this.loading1 = true;
            this.updateVisibleData(index);
          }
        }
      },
      shiftSelect(val){
        if (val.length==2) {
          this.selectRange();
        }
      },
  }
};
</script>
