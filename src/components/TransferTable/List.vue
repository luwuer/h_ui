<template>
  <div :class="classes" :style="listStyle">
    <div :class="prefixCls + '-header'" v-if="showTitle">
      <span :class="prefixCls + '-header-title'" @click="toggleSelectAll(!checkedAll)">{{ title }}</span>
      <span :class="prefixCls + '-header-count'">{{ count }}</span>
    </div>
    <div :class="bodyClasses">
      <ul :class="prefixCls + '-content'">
        <h-edit-gird
          ref="table"
          :data="data"
          :columns="columns"
          :stripe="stripe"
          :border="border"
          :rowSelect="rowSelect"
          :highlight-row="highlightRow"
          :showEditInput ="showEditInput"
          :option="option"
          :treeOption="treeOption"
          :height="height"
          @on-current-change="currentChange"
          @on-selection-change="selectionChange"
          @on-row-click="rowClick"
          :no-data-text="notData"
        ></h-edit-gird>
      </ul>
    </div>
    <div :class="prefixCls + '-footer'" v-if="showFooter"><slot></slot></div>
  </div>
</template>
<script>
  import Search from './Search.vue';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import Draggable from 'vuedraggable';

  export default {
    name: 'TransferList',
    components: { Search, Checkbox, Draggable},
    props: {
      prefixCls: String,
      data: Array,
      columns:Array,
      stripe:Boolean,
      border:Boolean,
      rowSelect:Boolean,
      highlightRow:Boolean,
      showEditInput:Boolean,
      option:Array,
      treeOption:Array,
      width:Number,
      height:Number,
      title: [String, Number],
      showTitle:Boolean,
      width:[String, Number],
      notData: String,
    },
    data () {
        return {
            showItems: [],
            query: '',
            showFooter: true,
            showData:false,
        };
    },
    watch: {
        data () {
            this.updateFilteredData();
        }
    },
    computed: {
        listStyle(){
          let style={};
          if (this.width) {
              style.width = this.width+'px'
              return style;
          }
        },
        classes () {
            return [
                `${this.prefixCls}`,
                {
                    [`${this.prefixCls}-with-footer`]: this.showFooter,
                    [`${this.prefixCls}-with-title`]: this.showTitle,
                }
            ];
        },
        bodyClasses () {
            return [
                `${this.prefixCls}-body`,
                {
                    [`${this.prefixCls}-body-with-search`]: this.filterable,
                    [`${this.prefixCls}-body-with-footer`]: this.showFooter
                }
            ];
        },
        count () {
            const validKeysCount = this.validKeysCount;
            return (validKeysCount > 0 ? `${validKeysCount}/` : '') + `${this.data.length}`;
        },
        checkedAll () {
            return this.data.filter(data => !data.disabled).length === this.validKeysCount && this.validKeysCount !== 0;
        },
        checkedAllDisabled () {
            return this.data.filter(data => !data.disabled).length <= 0;
        },
        filterData () {
            if (this.data.length == 0) {
               this.showData = true;
            }else {
               this.showData = false;
            }
            return this.showItems.filter(item => this.filterMethod(item, this.query));
        }
    },
    methods: {
      itemClasses (item) {
        return [
            `${this.prefixCls}-content-item`,
            {
                [`${this.prefixCls}-content-item-disabled`]: item.disabled
            }
        ];
      },
      showLabel (item) {
        return this.renderFormat(item);
      },
      isCheck (item) {
        return this.checkedKeys.some(key => key === item.key);
      },
      select (item) {
        if (item.disabled) return;
        const index = this.checkedKeys.indexOf(item.key);
        index > -1 ? this.checkedKeys.splice(index, 1) : this.checkedKeys.push(item.key);
      },
      updateFilteredData () {
        this.showItems = this.data;
      },
      toggleSelectAll (status) {
          const keys = status ?
                  this.data.filter(data => !data.disabled || this.checkedKeys.indexOf(data.key) > -1).map(data => data.key) :
                  this.data.filter(data => data.disabled && this.checkedKeys.indexOf(data.key) > -1).map(data => data.key);
          this.$emit('on-checked-keys-change', keys);
      },
      handleQueryClear () {
        this.query = '';
      },
      handleQueryChange (val) {
        this.query = val;
      },
      getdata: function(evt){
      },
      datadragEnd:function(evt){ 
      },
      currentChange(cur,old){
        this.$emit('on-current-change',cur,old)
      }, 
      selectionChange(sel){
        this.$emit('on-selection-change',sel)
      },
      rowClick(val){
        this.$emit('on-row-click',val)
      } 
    },
    created () {
        // this.updateFilteredData();
    },
    mounted () {
        this.showFooter = this.$slots.default !== undefined;
    }
  };
</script>
<style type="text/css">

    .sortable-parent li:hover {
        background: transparent;
    }
    .sortable-chosen {
        background: #fff!important;
    }
    
    .sortable-ghost {
        background: #f3f3f3!important;
    }
    /*
     .sortable-ghost {
        border-bottom: solid 1px #ddd;
        height: 0;
        padding: 0!important;
     }
     .sortable-ghost label,
     .sortable-ghost span {
        display: none;
     }*/
</style>
