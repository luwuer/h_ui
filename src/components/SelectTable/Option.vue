<template>
  <Table
    ref="table"
    :data="rebuildData"
    :columns="tabColumns"
    :stripe="stripe"
    :show-header="showHeader"
    :noDataText="noDataText"
    :noFilteredDataText="noFilteredDataText"
    :rowSelect = "rowSelect"
    :hasWidth="hasWidth"
    :canDrag="canDrag"
    :disabledHover="disabledHover"
    :loading="loading"
    :highlightRow="highlightRow"
    :selectOption="true"
    @on-current-change="currentchange"
    @on-current-change-cancle="currentchangecancle"
    @on-select="select"
    @on-select-cancel="selectCancel"
    @on-select-all = "selectAll"
    @on-selection-change = "selectionChange"
    @on-sort-change = "sortChange"
    @on-row-click = "rowClick"
    >
  </Table>
</template>
<script>
  import Emitter from '../../mixins/emitter';
  import Table from '../Table'
  import Checkbox from '../Checkbox/Checkbox.vue';
  import {hasClass,getStyle,typeOf,scrollAnimate,getScrollBarSize} from '../../util/tools';
  const prefixCls = 'h-select-Table';
  const mutiArr=[{type: 'selection',width: 60,align: 'center',title:'#'}];
  export default {
    name: 'TabelOption',
    componentName: 'tabel-option',
    mixins: [ Emitter],
    components:{Checkbox,Table},
    props: {
      value: {
        type: [String, Number],
        required: false,
      },
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
      stripe: {
        type: Boolean,
        default: false
      },
      showHeader:{
        type: Boolean,
        default:false,
      },
      canDrag:{
        type:Boolean
      },
      disabledHover:{
        type:Boolean
      },
      loading:{
        type:Boolean,
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      rowSelect:{
        type:Boolean,//多选时是否支持点击行选中
        default:false
      },
      highlightRow:{
        type:Boolean,//多选时是否支持点击行选中
        default:true,
      }
    },
    data () {
      return {
        selected: false,
        index: 0,
        isFocus: false,
        hidden: false,
        multiple:false,
        hasWidth:null,
        tabColumns:this.columns,
        matchWay: '',
        matchArr:[],
        col:null,
        matchable:null,
        rebuildData:this.data
      };
    },
    computed: {
    },
    methods: {
      currentchange(cur,old){//单选专用
        if (this.disabled) return false;
        if (this.multiple && !this.highlightRow) return false;
        this.dispatch('SelectTable', 'on-select-selected', cur,'highlight');
        this.$emit('on-change',cur);
      },
      currentchangecancle(cur,old){
        if (this.disabled) return false;
        if (this.multiple && !this.highlightRow) return false;
        this.dispatch('SelectTable', 'on-select-selected', cur,'highlight');
      },
      select(sel,cur){
        this.dispatch('SelectTable', 'on-select-selected', cur);
        this.$emit('on-select',sel,cur);
      },
      selectCancel(sel,cur){
        this.dispatch('SelectTable', 'on-select-selected', cur);
        this.$emit('on-select',sel,cur);
      },
      selectAll(cur){
        this.dispatch('SelectTable', 'on-select-all', cur);
        this.$emit('on-select',cur);
      },
      selectionChange(cur){
        this.$emit('on-selection-change',cur);
        // this.dispatch('SelectTable', 'on-select-selected', cur);
      },
      sortChange(){
      },
      rowClick(){
      },
      blur () {
        this.isFocus = false;
      },
      matchData(val,clomn,col){
        if (!val||val == '') return this.matchable?false:true;
        let index = String(clomn[col]).indexOf(val);
        switch (this.matchWay){
          case 'blurry':
            return index>=0?true:false;
            break;
          case 'left':
            return index == 0?true:false;
            break;
          case 'all':
            return val==clomn[col]?true:false;
            break;
          default:
            return false;
        }
      },
      queryChange (val) {
        let _this = this;
        const col = this.col
        const matchWay = this.matchWay;
        const parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.matchArr = [];
        this.data.forEach((clomn,i)=>{
          let isSuccess = false;
          if (typeOf(col)==='string') {
            isSuccess = _this.matchData(parsedQuery,clomn,col)
          }
          if (typeOf(col)==='array') {
            isSuccess = col.some(item=>{
              return _this.matchData(parsedQuery,clomn,item);
            })
          }
          if (isSuccess) _this.matchArr.push(i);

        });
      },
      // filterData(arr){
      //   let filterData = []
      //   arr.forEach(col=>{
      //     filterData.push(this.data[col])
      //   })
      //   this.rebuildData = filterData;
      // }
    },
    mounted () {
      this.dispatch('SelectTable', 'append');
      this.$on('on-select-close', () => {
        this.isFocus = false;
      });
      this.$on('on-query-change', (val) => {
        this.queryChange(val);
      });
      let el = this.$parent.$parent.$el;
      this.multiple=hasClass(el,'h-selectTable-multiple')?true:false;
      let width =this.$parent.dropWidth>0?this.$parent.dropWidth:parseInt(getStyle(el, 'width'));
      this.hasWidth = width-getScrollBarSize();
      this.tabColumns = this.$parent.$parent.multiple?mutiArr.concat(this.tabColumns):this.tabColumns;
      this.matchWay = this.$parent.$parent.matchWay;
      this.matchable = this.$parent.$parent.matchable;
      this.col = this.$parent.$parent.matchCol;
    },
    beforeDestroy () {
      this.dispatch('SelectTable', 'remove');
    },
    watch:{
      matchArr(val){
        if (!this.matchable) {
          let filterData = []
          val.forEach((i)=>{
            filterData.push(this.data[i]);
          })
          this.rebuildData = filterData;
          this.$nextTick(()=>{
            this.$parent.$parent.updateOptions(false);
          })
          // this.$refs.table.selectFilterData(val);
        }else{
          this.$refs.table.toggleMached(val);
          this.$nextTick(()=>{
            let firstItem = this.$refs.table.$el.querySelectorAll('.h-table-row-filterable')[0];
            if (firstItem) {
              let top = firstItem.offsetTop;
              this.$parent.$parent.$refs.list.scrollTop=top;
              // scrollAnimate(this.$parent.$parent.$refs.list,this.$parent.$parent.$refs.list.scrollTop,top);
            }else{
              this.$parent.$parent.$refs.list.scrollTop=0;
              // scrollAnimate(this.$parent.$parent.$refs.list,this.$parent.$parent.$refs.list.scrollTop,0);
            }
          });
        }
      },
      data(val){
        this.rebuildData = val;
        if (val&&val.length>0) {
          this.dispatch('SelectTable', 'append');
        }
      },
      columns(val){
        this.tabColumns = val;
        this.tabColumns = this.$parent.$parent.multiple?mutiArr.concat(this.tabColumns):this.tabColumns; 
      },
    }
  };
</script>
