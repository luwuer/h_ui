<template>
  <div :class="wrapClasses" :style="styles" @mouseleave="handleMouseLeave($event)" ref="tableWrap">
    <div :class="classes">
      <div :class="[prefixCls + '-title']" v-if="showSlotHeader" ref="title"><slot name="header"></slot></div>
      <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" @mousewheel="handleMouseWheel">
        <table-head
          ref="thead"
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :obj-data="objData"
          :columns-width="columnsWidth"
          :data="rebuildData"
          @on-change-width="changeWidth"
          :canDrag="canDrag &&!!border"
          :canMove="canMove"
          :headAlgin="headAlgin"
          :lastColWidth="lastColWidth"
          :minDragWidth="minDragWidth"
          :multiLevel="cloneMultiLevel"
          ></table-head>
      </div>
      <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="body" @scroll="handleBodyScroll"
        v-show="!((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">
        <table-body
          ref="tbody"
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :data="rebuildData"
          :columns-width="columnsWidth"
          :rowSelect = "rowSelect"
          :bodyAlgin ="bodyAlgin"
          :obj-data="objData"
          :showTitle="showTitle"></table-body>
      </div>
      <div :class="[prefixCls + '-tip'] "
        v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))" @scroll="handleBodyScroll" :style="bodyStyle">
        <div :class="[prefixCls+'-tiptext']" :style="textStyle" >
          <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
          <span v-html="localeNoFilteredDataText" v-else></span>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" :style="tipStyle">
          <tbody>
            <tr>
               <!-- <td :style="{ 'height': bodyStyle.height}">  -->
               <td :style="{ 'height': tipBodyHeight + 'px'}"> 
               <!--  <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
                <span v-html="localeNoFilteredDataText" v-else></span> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" ref="leftF">
        <div :class="fixedHeaderClasses" v-if="showHeader">
          <table-head
            fixed="left"
            :prefix-cls="prefixCls"
            :styleObject="fixedTableStyle"
            :columns="leftFixedColumns"
            :obj-data="objData"
            :columns-width="columnsWidth"
            :data="rebuildData"
            :canDrag="canDrag &&!!border && canDragFixed"
            :canMove="Boolean(false)"
            :headAlgin="headAlgin"
            :lastColWidth="lastColWidth"
            :minDragWidth="minDragWidth"
            @on-change-width="changeWidth"
            ></table-head>
        </div>
        <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedBody">
          <table-body
            fixed="left"
            :prefix-cls="prefixCls"
            :styleObject="fixedTableStyle"
            :columns="leftFixedColumns"
            :data="rebuildData"
            :columns-width="columnsWidth"
            :rowSelect = "rowSelect"
            :bodyAlgin ="bodyAlgin"
            :obj-data="objData"
            :showTitle="showTitle"></table-body>
        </div>
      </div>
      <div :class="[prefixCls + '-fixed-right']" :style="fixedRightTableStyle" v-if="isRightFixed" ref="rightF">
        <div :class="fixedHeaderClasses" v-if="showHeader">
          <table-head
            fixed="right"
            :prefix-cls="prefixCls"
            :styleObject="fixedRightTableStyle"
            :columns="rightFixedColumns"
            :obj-data="objData"
            :columns-width="columnsWidth"
            :data="rebuildData"
            :canDrag="Boolean(false)"
            :canMove="Boolean(false)"
            :headAlgin="headAlgin"
            ></table-head>
        </div>
        <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedRightBody">
          <table-body
            fixed="right"
            :prefix-cls="prefixCls"
            :styleObject="fixedRightTableStyle"
            :columns="rightFixedColumns"
            :data="rebuildData"
            :columns-width="columnsWidth"
            :rowSelect = "rowSelect"
            :bodyAlgin ="bodyAlgin"
            :obj-data="objData"
            :showTitle="showTitle"></table-body>
        </div>
      </div>
      <div :class="[prefixCls + '-summation']" :style="summationStyle" v-if="isSummation" ref="summation">
        <!-- <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedRightBody"> -->
        <table-body
          ref='sumBody'
          :sum = 'isSummation'
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :data="makeSumData()"
          :obj-data="makeSumObjData()"
          :columns-width="columnsWidth"
          :bodyAlgin ="bodyAlgin"
          :showTitle="showTitle"></table-body>
        <!-- </div> -->
      </div>
      
      <div class="h-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"> </div>
      <div class="h-table__column-move-proxy h-table-cell" ref="moveProxy" v-show="moveProxyVisible"> </div>

      <div :class="[prefixCls + '-fixed-right-patch']" :style="fixedRightPatchStyle" v-if="isRightFixed&&showScroll" ref="rightPatch"></div>
      <div :class="[prefixCls + '-footer']" v-if="showSlotFooter" ref="footer"><slot name="footer"></slot></div>
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
import tableHead from './Table-head.vue';
import tableBody from './Table-body.vue';
import Spin from '../Spin/Spin.vue';
import { oneOf, getStyle, deepCopy, getScrollBarSize,findInx,getBarBottom,typeOf} from '../../util/tools';
import { on, off } from '../../util/dom';
import Csv from '../../util/csv';
import ExportCsv from './export-csv';
import Locale from '../../mixins/locale';

const prefixCls = 'h-table';

let rowKey = 1;
let columnKey = 1;

export default {
  name: 'Table',
  mixins: [ Locale ],
  components: { tableHead, tableBody },
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
      type: [Number, String]
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
    canDragFixed:{
      type:Boolean,
      default:false
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
    lastColWidth:{
      type:[Number,String],
      default:80,
    },
    minDragWidth:{
      type:[Number,String],
      default:30,
    },
    patibleHeight:{//兼容高度
      type:Boolean,
      default:false,
    },
    multiLevel:{
      type:Array,
      default:null
    },
    summationData: {
      type: Array,
      default () {
        return [];
      }
    },
    maxHeight: {
      type: [Number, String]
    },
    notSort: {
      type:Boolean,
      default:false,
    }
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
      moveProxyVisible:false,
      showScroll:false,
      headerRealHeight:0,
      selectType:false,
      buttomNum:null,
      topNum: null,
      keepAliveFlag: false, // 页面是否缓存
      sumMarginLeft: 0,
      shiftSelect:[],
      ctrlSelect:[],
    };
  },
  computed: {
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
    styles () {
      let style = {};
      if (this.height) {
        const height = (this.isLeftFixed || this.isRightFixed) ? parseInt(this.height) + this.scrollBarWidth : parseInt(this.height);
        // style.height = this.patibleHeight?`${this.height}px`:`${height+2}px`;
        style.height = this.patibleHeigh ? this.height : this.height + 2
        this.$nextTick(() => {
          if (this.isSummation) style.height += this.$refs.summation.clientHeight
        })
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
          if (this.bodyHeight > this.bodyRealHeight && this.data.length>0) {
            width = this.tableWidth;
          } else {
            width = this.tableWidth - this.scrollBarWidth;
          }
        }
        style.width = `${width}px`;
      }
      return style;
    },
    tipStyle () {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = this.tableWidth;
        style.width = `${width}px`;
      }
      return style;
    },
    tipBodyHeight () {
      let style = {};
      let bodyStyleHeight = 0
      //  获取原先bodyStyle中的height
      if (this.bodyHeight !== 0) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
        bodyStyleHeight = this.patibleHeight ? this.bodyHeight : height
      }
      // 判断是否有横向滚动条
      if (this.tableWidth !== 0 && this.initWidth != 0) {
        bodyStyleHeight = this.tableWidth > this.initWidth ? bodyStyleHeight - this.scrollBarWidth : bodyStyleHeight
      }
      return bodyStyleHeight
    },
    fixedHeaderClasses () {
      return [
        `${prefixCls}-fixed-header`,
        {
          [`${prefixCls}-fixed-header-with-empty`]: !this.rebuildData.length
        }
      ];
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
      let height = 0;
      this.rightFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === 'right') width += col._width;
      });
      if (this.bodyHeight !== 0) {
        height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
        height = this.patibleHeight?this.bodyHeight:height;
      }
      if (height && height < this.bodyRealHeight) {
        style.marginRight = `${this.scrollBarWidth}px`;
        this.showScroll = true;
      }else{
        // width = width==0?0:width+this.scrollBarWidth;
        width = width==0?0:width;
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
      if (this.bodyHeight !== 0 || this.maxHeight) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
        if (this.height) style.height = this.patibleHeight?`${this.bodyHeight}px`:`${height}px`;
        if (this.maxHeight) style.maxHeight = this.patibleHeight?`${this.bodyHeight}px`:`${height}px`;
      }
      return style;
    },
    fixedBodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0 || this.maxHeight) {
        let height =this.patibleHeight?this.bodyHeight-this.scrollBarWidth:this.bodyHeight;
        if (this.tableWidth < this.initWidth+1) {
          height = height + this.scrollBarWidth-1;
        }
        // height不存在时bodyheight为0
        if (this.height) style.height = this.scrollBarWidth > 0 ? `${height}px` : `${height}px`;
        if (this.maxHeight) style.maxHeight = this.scrollBarWidth > 0 ? `${height}px` : `${height}px` 
      }
      return style;
    },
    textStyle(){
      let style = {};
      // style.width = this.initWidth!=0?this.initWidth+'px': this.hasWidth ? this.hasWidth+'px' : '100%';
      style.width = this.initWidth!=0?this.initWidth+'px':'100%';
      let height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
      height = this.patibleHeight?height-2:height;
      style.height = this.height || this.maxHeight ? Number(height-this.scrollBarWidth)+'px':null;
      style.lineHeight = this.height  || this.maxHeight ? Number(height-this.scrollBarWidth)+'px':null;
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
    rightFixedColumns () {
        let right = [];
        let other = [];
        this.cloneColumns.forEach((col) => {
            if (col.fixed && col.fixed === 'right') {
                right.push(col);
            } else {
                other.push(col);
            }
        });
        return right.concat(other);
    },
    isLeftFixed () {
        return this.columns.some(col => col.fixed && col.fixed === 'left');
    },
    isRightFixed () {
        return this.columns.some(col => col.fixed && col.fixed === 'right');
    },
    isSummation () {
      return this.summationData.length > 0 && !this.isRightFixed && !this.isLeftFixed
    },
    summationStyle () {
      return {
        marginLeft: `${0 - this.sumMarginLeft}px`
      }
    },
    cloneMultiLevel () {
      if (!this.multiLevel || this.multiLevel.length==0) return null;
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
      return data.length>0?data:null;
    }
  },
  methods: {
    rowClsName (index) {
      return this.rowClassName(this.data[index], index);
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
    handleMouseLeave() {      
    },
    handleResize () {
      // keep-alive时，页面改变大小会不断触发resize【非本组件页面】
      this.$nextTick(() => {
        if(this.columns.length==0) return;
        const allWidth = !this.cloneColumns.some(cell => !cell.width&&cell.width!==0);    // each column set a width
        if (allWidth) {
          this.tableWidth = this.cloneColumns.map(cell => cell.width).reduce((a, b) => a + b);
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
          this.cloneColumns.forEach((cell,i)=>{})
          if (this.data.length && this.$refs.tbody) {
            const $td = this.$refs.tbody.$el.querySelectorAll('tbody tr')[0].querySelectorAll('td');
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
              this.cloneColumns[i]._width = this.hasWidth?width:width||'';
              this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b)||this.tableWidth;
              columnsWidth[column._index] = {
                  width: width
              };
            }
            this.columnsWidth = columnsWidth;
          }else{
            if (!this.$refs.thead) return;
            const $th = this.$refs.thead.$el.querySelectorAll('thead .cur-th')[0].querySelectorAll('th');
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
          this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0; 
        });
        // get table real height,for fixed when set height prop,but height < table's height,show scrollBarWidth
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'))||0;
        this.headerRealHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
      });
    },
    getshiftSelect(_index){
      if(!this.highlightRow) return;
      switch(this.shiftSelect.length){
        case 0:
          this.shiftSelect[0]=_index;
          break;
        case 1:
          let min=Math.min(this.shiftSelect[0],_index);
          let max = Math.max(this.shiftSelect[0],_index);
          this.$set(this.shiftSelect,0,min);
          this.$set(this.shiftSelect,1,max);
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
      if(!this.highlightRow) return;
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
          this.$emit('on-current-change-cancle',JSON.parse(JSON.stringify(this.cloneData[_index])), oldData,_index);
        }else{
          this.objData[_index]._isHighlight = true;
          this.objData[_index]._isChecked = true;
          this.$emit('on-current-change', JSON.parse(JSON.stringify(this.cloneData[_index])), oldData,_index);
        }
        if (this.columns.length>0 && (this.columns[0].type=='selection'||this.columns[1].type=='selection')) {
          const selection = this.getSelection();
          const selectionInx = this.getSelection(true);
          this.$emit('on-selection-change', selection,selectionInx);
        }
    },
    clickCurrentRow (_index) {
      //click row
      // window.getSelection()?window.getSelection().removeAllRanges():document.selection.empty();
      if (!window.event.shiftKey && !window.event.ctrlKey) {
        if(!this.rowSelect){
          this.highlightCurrentRow (_index);
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
      }else if(window.event.shiftKey){
        window.getSelection()?window.getSelection().removeAllRanges():document.selection.empty();
        this.getshiftSelect(_index);  
      }else{
        this.getctrlSelect(_index);
      }

      // if (!this.rowSelect) {
      //   this.highlightCurrentRow (_index);
      // }
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
      //click checkbox
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
      //shift
      if (window.event.shiftKey&&_index) {
        this.getshiftSelect(_index);
      }else if(!status){
        this.shiftSelect=[]
        this.shiftSelect[0] = _index;
      }else{
        this.shiftSelect=[]
      }
      const selection = this.getSelection();
      const selectionInx = this.getSelection(true);
      this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(this.data[_index])));
      this.$emit('on-selection-change', selection,selectionInx);
    },
    clearAllRow(){
      for (let i in this.objData) {
          if (this.objData[i]._isHighlight) {
            this.objData[i]._isHighlight = false;
          }
      }
    },
    clearSingle(_index,status){
      this.$nextTick(()=>{
        this.objData[_index]._isHighlight=status;
      })
    },
    clearSelect(_index,status){
      this.$nextTick(()=>{
        this.objData[_index]._isChecked=status;
      })
    },
    enterSingle(_index,status){
      this.$nextTick(()=>{
        this.objData[_index]._isHighlight=status;
        this.$emit('on-current-change', JSON.parse(JSON.stringify(this.cloneData[_index])), '',_index);
      });
    },
    enterSelect(_index,status){
      this.$nextTick(()=>{
        this.objData[_index]._isChecked=status;
        const selection = this.getSelection();
        this.$emit('on-select' , selection, JSON.parse(JSON.stringify(this.data[_index])));
      });
    },
    changeHover(_index,status){
      this.$nextTick(()=>{
        // if (!this.rebuildData||this.rebuildData.length==0)return false;
        // if (!this.rebuildData[_index]) _index=0;
        // let index = this.rebuildData[_index]._index; 
        if (!this.objData[_index]) return false;
        this.objData[_index]._isHover=status;
      })
    },
    toggleMached(arr){
      for (let i in this.objData) {
        this.objData[i]._isMatched = false;//取消所有匹配项，估值6.0专用
      }
      if (arr.length == 0) return false;
      arr.map(inx=>{this.objData[inx]._isMatched = true;});
    },
    selectFilterData(arr){
      let filterData = [];
      let data = this.makeData();
      arr.forEach(col=>{
        filterData.push(data[col]);
      });
      this.rebuildData = filterData;
    },
    toggleExpand (_index) {
        let data = {};

        for (let i in this.objData) {
            if (parseInt(i) === _index) {
                data = this.objData[i];
            }
        }
        const status = !data._isExpanded;
        this.objData[_index]._isExpanded = status;
        this.$emit('on-expand', JSON.parse(JSON.stringify(this.cloneData[_index])), status);
    },
    itemSelect(i,status){
      let index = this.rebuildData[i]._index;
      // if (index == undefined) return;
      this.objData[index]._isHighlight=false;
      if(!this.objData[index]._isDisabled){
        this.objData[index]._isChecked = status;
      }
    },
    selectAll (status) {
      for(const data of this.rebuildData){
        this.objData[data._index]._isHighlight=false;
        if(this.objData[data._index]._isDisabled){
          continue;
        }else{
          this.objData[data._index]._isChecked = status;
        }
      }
      const selection = this.getSelection();
      const selectionInx = this.getSelection(true);
      this.$emit('on-select-all', selection);
      this.$emit('on-selection-change', selection,selectionInx);
    },
    fixedHeader () {
      // height与maxHeight不可同时存在，若同时存在则以height为准
        if (this.height || this.maxHeight) {
          let setHeight = parseInt(this.height) || parseInt(this.maxHeight)
            this.$nextTick(() => {
                const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0;
                if (titleHeight>0) {
                  if(this.$refs.leftF)this.$refs.leftF.style.marginTop=titleHeight+'px';
                  if(this.$refs.rightF)this.$refs.rightF.style.marginTop=titleHeight+'px';
                }
                // const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
                const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
                const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0;
                // this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight;
                this.bodyHeight = setHeight - titleHeight - headerHeight - footerHeight;
            });
        } else {
            this.bodyHeight = 0;
        }
    },
    hideColumnFilter () {
        this.cloneColumns.forEach((col) => col._filterVisible = false);
    },
    handleBodyScroll (event) {
        if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
        if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
        if (this.isRightFixed) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
        this.hideColumnFilter();
        if (this.isSummation) this.sumMarginLeft = event.target.scrollLeft
        this.buttomNum = getBarBottom(event.target,this.scrollBarWidth);
        this.topNum = event.target.scrollTop
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
    handleSort (_index, type) {
      if(_index=='all'){
        this.rebuildData = this.makeDataWithFilter();
        this.cloneColumns.forEach((col,i)=>{
          this.cloneColumns[i]._sortType = type;
        })
        return;
      }
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
    },
    sortCloumn (curIndex,insertIndex,_index){
      if (this.cloneColumns[insertIndex].fixed) return;
      const item = this.cloneColumns[curIndex];
      this.cloneColumns.splice(curIndex,1);
      this.cloneColumns.splice(insertIndex,0,item);
      this.$emit('on-move',_index,insertIndex);
    },
    setMoveProxy(index){  
      let el = this.$refs.moveProxy;
      let width = this.cloneColumns[index]._width;
      el.style.width = width+'px';
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
    handleFilterHide (_index) {    // clear checked that not filter now
      let index = this.getIndex(_index);
        if (!this.cloneColumns[index]._isFiltered) this.cloneColumns[index]._filterChecked = [];
    },
    filterData (data, column) {
      return data.filter((row) => {
        //如果定义了远程过滤方法则忽略此方法
        if (typeof column.filterRemote === 'function') return true;

        let status = !column._filterChecked.length;
        for (let i = 0; i < column._filterChecked.length; i++) {
            status = column.filterMethod(column._filterChecked[i], row);
            if (status) break;
        }
        return status;
      });
    },
    filterOtherData (data, index) {
        let column = this.cloneColumns[index];
        if (typeof column.filterRemote === 'function') {
            column.filterRemote.call(this.$parent, column._filterChecked, column.key, column);
        }

        this.cloneColumns.forEach((col, colIndex) => {
            if (colIndex !== index) {
                data = this.filterData(data, col);
            }
        });
        return data;
    },
    handleFilter (_index,isIndex) {
        let index;
        if (isIndex) {
          index = _index;
        }else{
          index = this.getIndex(_index);
        }
        const column = this.cloneColumns[index];
        let filterData = this.makeDataWithSort();

        // filter others first, after filter this column
        filterData = this.filterOtherData(filterData, index);
        this.rebuildData = this.filterData(filterData, column);

        this.cloneColumns[index]._isFiltered = true;
        this.cloneColumns[index]._filterVisible = false;
    },
    handleFilterSelect (_index, value) {
        let index = this.getIndex(_index);
        this.cloneColumns[index]._filterChecked = [value];
        this.handleFilter(index,true);
    },
    handleFilterReset (_index) {
        let index = this.getIndex(_index);
        this.cloneColumns[index]._isFiltered = false;
        this.cloneColumns[index]._filterVisible = false;
        this.cloneColumns[index]._filterChecked = [];

        let filterData = this.makeDataWithSort();
        filterData = this.filterOtherData(filterData, index);
        this.rebuildData = filterData;
    },
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
    makeDataWithFilter () {
      let data = this.makeData();
      this.cloneColumns.forEach(col => data = this.filterData(data, col));
      return data;
    },
    makeDataWithSortAndFilter () {
      let data = this.makeDataWithSort();
      this.cloneColumns.forEach(col => data = this.filterData(data, col));
      return data;
    },
    makeSumObjData () {
      let data = {};
      this.summationData.forEach((row, index) =>{
        data[index] = deepCopy(row)
      })
      return data;
    },
    makeSumData () {
      // 汇总数据只有一条，否则只获取第一条
      let data = this.summationData && this.summationData.length > 0 ? [deepCopy(this.summationData[0])] : []
      data.forEach((row, index) => {
          row._index = index;
          row._rowKey = rowKey++;
      });
      return data;
    },
    makeObjData () {
      let data = {};
      this.data.forEach((row, index) => {
        const newRow = deepCopy(row);// todo 直接替换
        newRow._isHover = false;
        // ['_checked','_disabled','_expanded','_highlight','_isMatched'].forEach(col=>{
        //   if(newRow[col]&&newRow[col]!='false'){
        //     newRow[col]=newRow[col];
        //   }else{
        //     newRow[col]=false;
        //   }
        // })
        if (newRow._disabled && newRow._disabled!='false') {
            newRow._isDisabled = newRow._disabled;
        } else {
            newRow._isDisabled = false;
        }
        if (newRow._checked && newRow._checked!='false') {
            newRow._isChecked = newRow._checked;
        } else {
            newRow._isChecked = false;
        }
        if (newRow._expanded && newRow._expanded!='false') {
            newRow._isExpanded = newRow._expanded;
        } else {
            newRow._isExpanded = false;
        }
        if (newRow._highlight && newRow._highlight!="false") {
            newRow._isHighlight = newRow._highlight;
        } else {
            newRow._isHighlight = false;
        }
        if (newRow._isMatched && newRow._isMatched!="fasle") {
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
        if(column.hiddenCol&&column.hiddenCol!="false"){
          // that.columns[index].width = 0;
          // column.width = 0;
          // column._width = 0;
        }
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
    exportCsv (params) {
        if (params.filename) {
            if (params.filename.indexOf('.csv') === -1) {
                params.filename += '.csv';
            }
        } else {
            params.filename = 'table.csv';
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

        // const data = Csv(columns, datas, ',', noHeader);
        const data = Csv(columns, datas, params, noHeader);
        ExportCsv.download(params.filename, data);
    },
    moveUp(colIndex){
      const curItem = this.rebuildData[colIndex];
      this.rebuildData.splice(colIndex,1,)
      this.rebuildData.splice(colIndex,0,curItem)
    },
    moveDown(colIndex){
      const curItem = this.rebuildData[colIndex];
      this.rebuildData.splice(colIndex,1,curItem )
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
  },
  created () {
      if (!this.context) this.currentContext = this.$parent;
      this.showSlotHeader = this.$slots.header !== undefined;
      this.showSlotFooter = this.$slots.footer !== undefined;
      this.rebuildData = this.makeDataWithSortAndFilter();
  },
  mounted () {
    this.$on('on-expand',()=>{
      this.$nextTick(()=>{
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'))||0;
        this.handleResize();
      })
    })
    this.handleResize();
    this.fixedHeader();
    this.$nextTick(() => {
      this.ready = true;
      this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0; 
    });
    //window.addEventListener('resize', this.handleResize, false);
    on(window, 'resize', this.handleResize);
    this.$on('on-visible-change', (val) => {
        if (val) {
            this.handleResize();
            this.fixedHeader();
        }
    });
  },
  activated() {
    if (this.keepAliveFlag) {
      this.handleResize();
      on(window, 'resize', this.handleResize);
    }
    this.keepAliveFlag = true    
  },
  deactivated() {
    if (this.keepAliveFlag) {
      off(window, 'resize', this.handleResize);
    }
  },
  beforeDestroy () {
      //window.removeEventListener('resize', this.handleResize, false);
      off(window, 'resize', this.handleResize);
  },
  watch: {
      data: {
        handler () {
          const oldDataLen = this.rebuildData.length;
          this.objData = this.makeObjData();
          this.rebuildData = this.makeDataWithSortAndFilter();
          this.handleResize();
          if (!oldDataLen) {
            this.fixedHeader();
          }
          // here will trigger before clickCurrentRow, so use async
          setTimeout(() => {
            this.cloneData = deepCopy(this.data);
            this.buttomNum = null;
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
        if (val==null || oldvalue==null) return;
        this.$emit('on-scroll',this.buttomNum,this.topNum);
      },
      shiftSelect(val){
        if (val.length==2) {
          this.selectRange();
        }
      }, 
  }
};
</script>
