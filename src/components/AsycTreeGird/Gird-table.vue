<template>
  <div :class="wrapClasses" :style="styles" @mouseleave="handleMouseLeave($event)" ref="tableWrap">
    <div :class="classes">
      <div :class="[prefixCls + '-title']" v-if="showSlotHeader" ref="title"><slot name="header"></slot></div>
      <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" @mousewheel="handleMouseWheel">
        <gird-head
          ref="thead"
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :obj-data="objData"
          :columns-width="columnsWidth"
          :data="rebuildData"
          ></gird-head>
      </div>
      <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="body" @scroll="handleBodyScroll"
        v-show="!((!!localeNoDataText && (!data || data.length === 0)) || ((!rebuildData || rebuildData.length === 0)))">
        <gird-body
          ref="tbody"
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :data="rebuildData"
          :columns-width="columnsWidth"
          :rowSelect = "rowSelect && selectType"
          :obj-data="objData"
          :showEditInput="showEditInput"
          :isCheckbox="isCheckbox"
          :checkStrictly="checkStrictly"
          :option="options"
          :treeOption="treeOptions"
          @on-select-change="selectChange"
          @on-editselect-change="editselectChange"
          @on-editinput-change="editinputChange"
          @on-editinput-blur="editinputBlur"
          @on-editarea-change="editAreaChange"
          @on-editarea-blur="editAreaBlur"
          ></gird-body>
      </div>
      <!-- <div :class="[prefixCls + '-tip']"
        v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!rebuildData || rebuildData.length === 0))">
        <table cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td :style="{ 'height': bodyStyle.height }">
                <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
     <div :class="[prefixCls + '-tip']"
        v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!rebuildData || rebuildData.length === 0))" @scroll="handleBodyScroll" :style="bodyStyle">
        <div class="h-table-tiptext" :style="textStyle" >
          <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" :style="tipStyle">
          <tbody>
            <tr>
              <td :style="{ 'height': bodyStyle.height }">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
import GirdHead from './Gird-head.vue';
import GirdBody from './Gird-body.vue';
import Spin from '../Spin/Spin.vue';
import Mixin from './mixin';
import { oneOf, getStyle, deepCopy, deepCopyEx, getScrollBarSize,getBarBottom,findInx} from '../../util/tools';
import { on, off } from '../../util/dom';
import Locale from '../../mixins/locale';
// import Csv from '../../util/csv';
// import ExportCsv from './export-csv';
const prefixCls = 'h-editgird';

let columnKey = 1;
let privateKey = ['_index', '_isShow', '_level', '_loaded', '_parent', '_rowNodeKey', '_spaceHtml', 'children', '_indeterminate']
export default {
  name: 'AsycTreeGird',
  mixins: [ Locale,Mixin ],
  components: { GirdHead, GirdBody },
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
      default: true
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
    showIndeterminate:{
      type:Boolean,
      default:false
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    rowSelect:{
      type:Boolean,//多选时是否支持点击行选中
      default:false
    },
    showEditInput:{
      type:Boolean,
      default:false
    },
    isCheckbox:{
      type:Boolean,
      default:false
    },
    checkStrictly:{
      type:Boolean,
      default:false
    },
    loading: {
      type: Boolean,
      default: false
    },
    option:{
      type: Array,
      default () {
        return [];
      }
    },
    treeOption:{
      type: Array,
      default () {
        return [];
      }
    },
    loadData: {
      type: Function
    },
  },
  data () {
    return {
      ready: false,
      tableWidth: 0,
      initWidth:0,
      tipWidth:0,
      columnsWidth: {},
      prefixCls: prefixCls,
      compiledUids: [],
      objData: {},     // checkbox or highlight-row
      rebuildData: [],    // for sort or filter
      cloneColumns: this.makeColumns(),
      showSlotHeader: true,
      bodyHeight: 0,
      bodyRealHeight: 0,
      scrollBarWidth: getScrollBarSize(),
      currentContext: this.context,
      cloneData: deepCopy(this.data),    // when Cell has a button to delete row data, clickCurrentRow will throw an error, so clone a data
      showScroll:false,
      headerRealHeight:0,
      selectType:false,
      options:this.option,
      treeOptions:this.treeOption,
      initData: [],
      currentRow: {}, // 行点击生成返回数据使用
      cursorIndex: 0 // 插入元素时的游标
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
    wrapClasses () {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
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
        const height = (this.isLeftFixed || this.isRightFixed) ? parseInt(this.height) + this.scrollBarWidth : parseInt(this.height);
        style.height = `${height+2}px`;
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
    bodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
        style.height = `${height}px`;
      }
      return style;
    },
    textStyle(){
      let style = {};
      style.width = this.initWidth!=0?this.initWidth+'px':'100%';
      const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
      style.height = this.height?Number(height-this.scrollBarWidth)+'px':null;
      style.lineHeight = this.height?Number(height-this.scrollBarWidth)+'px':null;
      return style;
    },
  },
  methods: {
    rowClsName (index) {
      return this.rowClassName(this.data[index], index);
    },
    handleMouseLeave() {
      
    },
    handleResize () {
      this.$nextTick(() => {
        const allWidth = !this.columns.some(cell => !cell.width&&cell.width!==0);    // each column set a width
        if (allWidth) {
          this.tableWidth = this.columns.map(cell => cell.width).reduce((a, b) => a + b);
        } else {
          this.tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
        }
        this.columnsWidth = {};
        this.$nextTick(() => {
          let columnsWidth = {};
          let autoWidthIndex = -1;
          // if (allWidth) autoWidthIndex = this.cloneColumns.findIndex(cell => !cell.width);//todo 这行可能有问题
          if (allWidth) autoWidthIndex = findInx(this.cloneColumns,cell => !cell.width);
          this.cloneColumns.forEach((cell,i)=>{})
          if (this.data.length) {
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
                  width = column.width||''
              } else {
                  if (width < 100) width = 100
              }

              this.cloneColumns[i]._width = width||'';

              columnsWidth[column._index] = {
                  width: width
              };
            }
            this.columnsWidth = columnsWidth;
          } else {
            if (!this.$refs.thead) return;
            const $th = this.$refs.thead.$el.querySelectorAll('thead tr')[0].querySelectorAll('th');
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
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
      });
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
      if (!this.highlightRow || this.objData[_index]._isHighlight) return;
      let oldIndex = -1;
      for (let i in this.objData) { 
        if (this.objData[i]._isHighlight) {
          oldIndex = parseInt(i);
          this.objData[i]._isHighlight = false;
        }
      }
      this.objData[_index]._isHighlight = true;
      const oldData = oldIndex < 0 ? null : JSON.parse(JSON.stringify(deepCopyEx(this.rebuildData[oldIndex], privateKey)));
      this.$emit('on-current-change', JSON.parse(JSON.stringify(this.currentRow)), oldData);
    },
    clickCurrentRow (_index) {
      this.currentRow  = deepCopyEx(this.rebuildData[_index], privateKey)
      this.$emit('on-row-click', [JSON.parse(JSON.stringify(this.currentRow)),_index]);
      
      if ((!this.rowSelect || !this.selectType) && this.highlightRow) {
        this.highlightCurrentRow(_index);
      }
    },
    dblclickCurrentRow (_index) {
      if ((!this.rowSelect || !this.selectType)&&this.highlightRow) {
        this.highlightCurrentRow (_index);
      }
      this.currentRow  = deepCopyEx(this.rebuildData[_index], privateKey)
      this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(this.currentRow)));
    },
    getSelection () {
      let selectionIndexes = [];
      for (let i in this.objData) {
        if (this.objData[i]._isChecked) selectionIndexes.push(parseInt(i));
      }
      return JSON.parse(JSON.stringify(this.rebuildData.filter((data, index) => selectionIndexes.indexOf(index) > -1)));
    },
    toggleSelect (_index) {
      let _this = this
      let data = {};
      for (let j in _this.objData) {
          if (parseInt(j) === _index) {
              data = _this.objData[j];
          }
      }
      const status = !data._isChecked;

      _this.objData[_index]._isChecked = status;

      const selection = this.getSelection();
      this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(this.rebuildData[_index])));
      this.$emit('on-selection-change', selection);
    },
    toggleExpand (index, item, isAutoLoad = false) {
      // isAutoLoad只有在初始化渲染时为true,其余包括点击等均为false
      // 兼容外(item属性已过滤)调用该方法
      item = this.rebuildData[index]
      let itemAutoLoad = Boolean(item.autoLoad)
      // 针对autoLoad自动调用toggleExpand方法
      // 首次加载时autoLoad为true，expand为false，或者其父节点expand为false,或者为叶子节点时直接返回
      if (isAutoLoad && itemAutoLoad && (!item.expand || item._parent && !item._parent.expand) && 'loading' in item && !item.loading && !item.leaf && this.loadData) return
      //-- 展开数据
      let _level = item._level + 1;
      let _spaceHtml = "";
      for (var i = 1; i < _level; i++) {
        _spaceHtml += "<i class='h-tree-space'></i>"
      }
      if (!item.children || item.children.length == 0) {
        // 真正加载数据是分autoload 为true或者false 的情况（考虑autoload expand为false时点击的情况）
        // 为true表示该节点自动加载，因此需要expand为true时才能触发
        // 为false时表示该节点手动点击展开触发，因此需要expand为false时才能触发
        if (this.loadData && 'loading' in item && !item.loading && ((!item.expand && !isAutoLoad) || (item.expand && itemAutoLoad && isAutoLoad))) {
          this.$set(this.rebuildData[index], 'loading', true);
          this.loadData(item, children => {
            // autoload有两个autoLoad节点时会出错
            index = item._index
            this.$set(this.rebuildData[index], 'loading', false);
            if (children.length) {
              item._loaded = true;
              item.expand = true
              this.$set(this.rebuildData[index], "children", children)
              this.cursorIndex = index
              this.expandBuildTree(item, index)
              this.cursorIndex = 0
              this.objData = this.makeObjData()
              const status = this.objData[index]._isExpanded
              this.$emit('on-expand', deepCopyEx(item, privateKey), status);
              // this.$nextTick(() => this.handleExpand());
            }
          })
        } else if (this.loadData && 'loading' in item && !item.loading && item.expand && !isAutoLoad &&!itemAutoLoad) {
          // 非autoload情况，需要手动点击去加载
          this.$set(this.objData[index], '_isExpanded' ,false)
          this.$set(this.objData[index], 'expand' ,false)
          item.expand = false
        }
      }else if (item.children && item.children.length > 0) {
        if (item.expand) {
            item.expand = !item.expand;
          this.close(index, item);
        } else {
          item.expand = !item.expand;
          if (item._loaded) { //已经加载过
            this.open(index, item);
          } else {
            // 为了兼容多选返回数据，初始化将静态数据全部加载，以下不会执行了
            item._loaded = true;
            this.cursorIndex = index
            this.expandBuildTree(item, index)
            this.cursorIndex = 0
          }
        }
        this.objData = this.makeObjData()
        const status = this.objData[index]._isExpanded
        this.$emit('on-expand', deepCopyEx(item, privateKey), status);
      }
      //--
    },
    expandBuildTree (item, index) {
      let _level = item._level + 1;
      let _spaceHtml = "";
        for (var i = 1; i < _level; i++) {
          _spaceHtml += "<i class='h-tree-space'></i>"
        }
      if (item.children && item.children.length > 0 && !item.leaf) {
        item.children.forEach((child, childIndex) => {
          this.cursorIndex++ 
          this.rebuildData.splice(this.cursorIndex, 0, child);
          //设置监听属性
          this.$set(this.rebuildData[this.cursorIndex], '_rowNodekey', child._rowNodeKey + '_' + childIndex);
          this.$set(this.rebuildData[this.cursorIndex], '_parent', item);
          this.$set(this.rebuildData[this.cursorIndex], '_level', _level);
          this.$set(this.rebuildData[this.cursorIndex], '_spaceHtml', _spaceHtml);
          this.$set(this.rebuildData[this.cursorIndex], '_isShow', true);
          this.$set(this.rebuildData[this.cursorIndex], '_loaded', false);
          if (this.loadData) this.$set(this.rebuildData[this.cursorIndex], 'checked', item.checked || child.checked);
          // length = length + 1
          // if (child.children && child.children.length > 0 && child.children.expand) {
          if (child.children && child.children.length > 0) { 
            this.$set(this.rebuildData[this.cursorIndex], '_loaded', true); 
            this.expandBuildTree(child, this.cursorIndex)
          } else {
            this.$set(this.rebuildData[this.cursorIndex], 'expand', false);
          }
        })
      }
    },
    open(index, item) {
      if (item.children) {
        // this.objData[index]._isExpanded = true
        item.children.forEach((child, childIndex) => {
          child._isShow = true;
          if (child.children && child.expand) {
              this.open(index + childIndex + 1, child);
          }
        })
      }
    },
    close(index, item) {
      if (item.children) {
        // this.objData[index]._isExpanded = false
        item.children.forEach((child, childIndex) => {
          child._isShow = false;
          child.expand = false;
          if (child.children) {
            this.close(index + childIndex + 1, child);
          }
        })
      }
    },
    selectAll (status) {
        for(const data of this.rebuildData){
          if(this.objData[data._index]._isDisabled){
            continue;
          }else{
            this.objData[data._index]._isChecked = status;
          }
        }
        const selection = this.getSelection();
        if (status) {
            this.$emit('on-select-all', selection);
        }
        this.$emit('on-selection-change', selection);
    },
    fixedHeader () {
        if (this.height) {
            this.$nextTick(() => {
                const headerHeight = this.headerRealHeight;
                this.bodyHeight = this.height - headerHeight;
            });
        } else {
            this.bodyHeight = 0;
        }
    },
    handleBodyScroll (event) {
      let _this = this;
      let buttomNum = getBarBottom(event.target,this.scrollBarWidth);
      this.$emit('on-scroll',buttomNum)
      if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
      const verifyTips = this.$refs.tbody.$el.querySelectorAll('.verify-tip')
      if (verifyTips && verifyTips.length>0) {
        for (let i = 0; i < verifyTips.length; i++) {
          let verifyTip = verifyTips[i];
          let canEdit = verifyTip.parentNode.querySelectorAll('.canEdit')[0];
          let left = canEdit.offsetLeft - event.target.scrollLeft;
          let width = verifyTip.getBoundingClientRect().width;
          if (width!=0) {
            this.tipWidth = width;
          }else{
            width = this.tipWidth;
          }
          verifyTip.style.left = left+'px';
          let top =canEdit.offsetTop+canEdit.getBoundingClientRect().height -event.target.scrollTop;
          verifyTip.style.top = top+'px';

          if (left<=0 || left> _this.initWidth-width || top<=this.headerRealHeight || top>=this.height ){
            verifyTip.style.display = 'none';
          }else{
            verifyTip.style.display = 'block';
          }        
        }
      }
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
    makeData (items, _level, parent) {
      //-- 初始化数据
        const flattTreeList = []
        let keyCounter = 0
        let that = this
        function flattTreeChildren (item, index, _level, parent) {
          let _spaceHtml = "";
          for (var i = 1; i < _level; i++) {
              _spaceHtml += "<i class='h-tree-space'></i>"
          }
          that.$set(item, '_parent', parent)
          that.$set(item, '_level', _level)
          that.$set(item, '_spaceHtml', _spaceHtml)
          
          if ((typeof item.expand) == "undefined") {
            that.$set(item, 'expand', false)
          }
          if ((typeof item.show) == "undefined") {
            that.$set(item, '_isShow', parent ? parent.expand : false)
          }
          if ((typeof item.checked) == "undefined" || !that.isCheckbox) {
            that.$set(item, 'checked', false)
          }
          that.$set(item, '_loaded', item.expand ? true : false)
          that.$set(item, '_rowNodeKey', parent ? parent._rowNodeKey + '_' + index : 'root' + index)
          that.$set(item, '_index', keyCounter ++)          
          flattTreeList.push(item)
          // if (item.children && item.expand && !item.leaf) {
          if (item.children && !item.leaf) {  
            that.$set(item, '_loaded', true)
            item.children.forEach((child, inx) => flattTreeChildren(child, inx , _level + 1, item))
          }
        }
        items.forEach((item, index) => {
          flattTreeChildren(item, index, _level, parent)
        })
        return flattTreeList
    },
    makeDataWithSort () {
    },
    makeDataWithFilter () {
    },
    //-- 初始化数据
    makeDataWithSortAndFilter () {
    },
    // 将数据转换成objData,同时rebuild rebuildData
    makeObjData () {
      let data = {};
      this.rebuildData.forEach((row, index) => {
        this.$set(row, '_index', index)
        const newRow = deepCopyEx(row, 'children');// todo 直接替换
        newRow._isHover = false;
        if (newRow._disabled) {
            newRow._isDisabled = newRow._disabled;
        } else {
            newRow._isDisabled = false;
        }
        if (newRow.checked) {
            newRow._isChecked = newRow.checked;
        } else {
            newRow._isChecked = false;
        }
        if (newRow.expand) {
            newRow._isExpanded = newRow.expand;
        } else {
            newRow._isExpanded = false;
        }
        if (newRow._highlight) {
            newRow._isHighlight = newRow._highlight;
        } else {
            newRow._isHighlight = false;
        }
        if (newRow._indeterminate) {
            newRow._indeterminate = newRow._indeterminate;
        } else {
            newRow._indeterminate = false;
        }
        data[index] = newRow;
      });
      return data;
    },
    makeColumns () {
      var that = this;
      let columns = deepCopy(this.columns);
      let center = [];

      columns.forEach((column, index) => {
        column._index = index;
        column._columnKey = columnKey++;
        column._width = column.width ? column.width : '';    // update in handleResize()
        if(!!column.hiddenCol){
          that.columns[index].width = 0;
          column.width = 0;
          column._width = 0;
        }
        column._sortType = 'normal';
        column._filterVisible = false;
        column._isFiltered = false;
        column._filterChecked = [];

        if (!column.hiddenCol) {
          center.push(column);
        }
      });
      return center;
    },
    getTreeSelection(){
      let selection = []
      for (let i in this.objData) {
        if (this.objData[i]._isChecked) {
          selection.push(deepCopyEx(this.rebuildData[i], privateKey));
        }
      }
      return selection;
    },
    selectChange(){
      this.$emit('on-select-change', this.getTreeSelection());
    },
    editselectChange(val,i,j){
      this.$emit('on-editselect-change', val,i,j);
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
    getCheckedNodes () {
      return this.rebuildData.filter(obj => obj.checked);
    },
    getAutoLoadNodes () {
      return this.rebuildData.filter(obj => obj.autoLoad);
    },
    updateTreeDown(node, changes = {}) {
      for (let key in changes) {
        this.$set(node, key, changes[key]);
      }
      // 如果当前节点leaf属性为true，则返回当前节点        
      if (node.children && !this.checkStrictly && !node.leaf) {
        node.children.forEach(child => {
            this.updateTreeDown(child, changes);
        });
      }
    },
    updateTreeUp(nodeKey){
      if (this.rebuildData[nodeKey]._parent) {
        const parentKey = this.rebuildData[nodeKey]._parent._index;
        if (typeof parentKey == 'undefined') return;
        const node = this.rebuildData[nodeKey];
        const parent = this.rebuildData[parentKey];
        if (node.checked == parent.checked && node._indeterminate == parent._indeterminate) return; // no need to update upwards

        if (node.checked == true) {
            this.$set(parent, 'checked', parent.children.every(node => node.checked));
            this.$set(parent, '_indeterminate', !parent.checked&&!this.showIndeterminate);
        } else {
            this.$set(parent, 'checked', false);
            this.$set(parent, '_indeterminate', parent.children.some(node => node.checked || node._indeterminate)&&!this.showIndeterminate);
        }
        this.updateTreeUp(parentKey);
      }
    },
    reUpdateData () {
      const checkedNodes = this.getCheckedNodes();
      const autoLoadNodes = this.getAutoLoadNodes()
      checkedNodes.forEach(node => {
          this.updateTreeDown(node, {checked: true});
          // propagate upwards
          // 不存在父节点，说明是根节点
          if (node._parent) {
            const parentKey = node._parent._index
            if (!parentKey && parentKey !== 0) return;//如过存在父节点
            const parent = this.rebuildData[parentKey];
            const childHasCheckSetter = typeof node.checked != 'undefined' && node.checked;//选中为true
            if (childHasCheckSetter && parent.checked != node.checked && !this.checkStrictly) {//当前子节点选中且父组件为选中
              this.updateTreeUp(node._index); // update tree upwards
            }
          }
      });
      // autoLoadNodes.forEach(node =>  {
      //   this.$set(node, 'autoLoad', true)
      // })
    },
    //导出数据
    // exportCsv (params) {
    //     if (params.filename) {
    //         if (params.filename.indexOf('.csv') === -1) {
    //             params.filename += '.csv';
    //         }
    //     } else {
    //         params.filename = 'table.csv';
    //     }

    //     let columns = [];
    //     let datas = [];
    //     if (params.columns && params.data) {
    //       columns = params.columns;
    //       datas = params.data;
    //     } else {
    //       columns = this.columns;
    //       // if (!('original' in params)) params.original = true;
    //       // datas = params.original ? this.data : this.rebuildData;
    //       datas = this.rebuildData
    //     }

    //     let noHeader = false;
    //     if ('noHeader' in params) noHeader = params.noHeader;

    //     const data = Csv(columns, datas, ',', noHeader);
    //     ExportCsv.download(params.filename, data);
    // },
    initResize(){
      this.$nextTick(() => {
        this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0; 
      });
    }

  },
  created () {
    if (!this.context) this.currentContext = this.$parent;
    this.rebuildData = this.makeData(deepCopy(this.data), 1, null)
    this.reUpdateData()
    this.objData = this.makeObjData()
    this.showSlotHeader = this.$slots.header !== undefined;
  },
  mounted () {
    if (this.showHeader) {
      if (!!this.size) {
        this.headerRealHeight = this.size=='small'?35:48;
      }else{
        this.headerRealHeight=42;
      }
    }
    if (this.columns[0].type && this.columns[0].type=='selection') {
      this.selectType=true;
    }
    this.handleResize();
    this.fixedHeader();
    this.$nextTick(() => {
      this.ready = true;
      this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0; 
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
      off(window, 'resize', this.handleResize);
      off(window, 'resize', this.initResize);
  },
  watch: {
      data: {
          handler () {
              const oldDataLen = this.rebuildData.length;
              this.rebuildData = this.makeData(deepCopy(this.data), 1, null)
              this.reUpdateData()
              this.objData = this.makeObjData();
              this.handleResize();
              if (!oldDataLen) {
                  this.fixedHeader();
              }
              // here will trigger before clickCurrentRow, so use async
              setTimeout(() => {
                  this.cloneData = deepCopy(this.data);
              }, 0);
          },
          deep: true
      },
      columns: {
          handler () {
              // todo 这里有性能问题，可能是左右固定计算属性影响的
              this.cloneColumns = this.makeColumns();
              this.rebuildData = this.makeData(deepCopy(this.data), 1, null)
              this.reUpdateData()
              this.handleResize();
          },
          deep: true
      },
      height () {
          this.fixedHeader();
      },
      option:{
        deep:true,
        handler(val){
          this.options = val;
        }
      },
      treeOption:{
        deep:true,
        handler(val){
          this.treeOptions = val;
        }
      }
  }
};
</script>
