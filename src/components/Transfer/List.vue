<template>
  <div :class="classes" :style="listStyle">
    <div :class="prefixCls + '-header'">
        <Checkbox v-if="!(contentSplit&&direcPanel=='right')" :value="checkedAll" :disabled="checkedAllDisabled" @on-change="toggleSelectAll"></Checkbox>
        <span :class="prefixCls + '-header-title'" @click="toggleSelectAll(!checkedAll)">{{ title }}</span>
        <span v-if="!contentSplit" :class="prefixCls + '-header-count'">{{ count }}</span>
        <span v-if="contentSplit&&direcPanel=='right'" :class="prefixCls + '-header-count head-clear'" @click="clearTarget">清除</span>
    </div>
    <div :class="bodyClasses">
        <div :class="prefixCls + '-body-search-wrapper'" v-if="filterable">
            <Search
                :prefix-cls="prefixCls + '-search'"
                :query="query"
                @on-query-clear="handleQueryClear"
                @on-query-change="handleQueryChange"
                :placeholder="filterPlaceholder"></Search>
        </div>
        <ul :class="prefixCls + '-content'">
            <Draggable :move="getdata" @update="datadragEnd" :options="{animation: 200}" v-model="filterData">
                <li
                    v-for="(item,i) in filterData"
                    :class="itemClasses(item)"
                    :key="i"
                    @click="select(item)">
                    <Checkbox v-if="!(contentSplit&&direcPanel=='right')" :value="isCheck(item)" :disabled="item.disabled" @on-change="checkChange($event,item)"></Checkbox>
                    <span v-html="showLabel(item)"></span>
                    <span v-if="contentSplit&&direcPanel=='right'" class="delete-icon"><Icon name="android-delete" @on-click="checkChange(false,item)"></Icon></span>
                </li>
                <li :class="prefixCls + '-content-not-found'" v-if="!showData">{{ notFoundText }}</li>
            </Draggable>
            <div :class="prefixCls + '-data-not-found'" v-if="showData">{{ notFoundData }}</div>
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
            renderFormat: Function,
            checkedKeys: Array,
            listStyle: Object,
            title: [String, Number],
            filterable: Boolean,
            filterPlaceholder: String,
            filterMethod: Function,
            notFoundText: String,
            notFoundData: String,
            validKeysCount: Number,
            direcPanel:String,
        },
        data () {
            return {
                showItems: [],
                query: '',
                showFooter: true,
                showData:false,
                contentSplit:false,
            };
        },
        watch: {
            data () {
                this.updateFilteredData();
            }
        },
        computed: {
            classes () {
                return [
                    `${this.prefixCls}`,
                    {
                        [`${this.prefixCls}-with-footer`]: this.showFooter
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
            filterData: {
                set: function (newVal) {
                    this.showItems = newVal
                },
                get: function () {
                    if (this.data.length == 0) {
                        this.showData = true;
                    }else {
                        this.showData = false;
                    }
                    return this.showItems.filter(item => this.filterMethod(item, this.query));
                }
            }
        },
        methods: {
            itemClasses (item) {
                return [
                    `${this.prefixCls}-content-item`,
                    {
                        [`${this.prefixCls}-content-item-disabled`]: item.disabled,
                        [`${this.prefixCls}-content-item-right`]: this.direcPanel=="right",
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
                if (item.disabled || this.contentSplit) return;
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
                if(this.contentSplit) this.$parent.changeRight(status);
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
                if (this.direcPanel == 'right') {
                    this.$emit('on-right-drag-change', this.filterData)
                }
            },
            clearTarget(){
                this.$parent.changeRight(false);
            },
            checkChange(status,item){
                if(!this.contentSplit) return false;
                if(status){
                    this.$parent.addRight(item);
                }else{
                    this.$parent.deleteRight(item);
                }
            }
              
        },
        created () {
            this.updateFilteredData();
        },
        mounted () {
            this.showFooter = this.$slots.default !== undefined;
            this.contentSplit = this.$parent.contentSplit;
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
