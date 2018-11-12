<template>
<div ref="block" @scroll="handleBodyScroll" :class="blockCls">
  <div :class="[prefixCls+'-phantom']" :style="phantomStl"></div>
  <ul :class="[prefixCls+'block-conten']" ref="content">
    <li v-for="(item,inx) in visibleData" :key="inx" v-show="!item.hidden" :class="classes(item)" @click.stop="select(item)" @mouseout.stop="blur">
      <checkbox v-show="multiple" size="large" :value="item.selected" @click.native.stop="handleclick" :disabled="item.disabled" @on-change="checkChange($event,item)"></checkbox>
      <slot>{{showLabel(item)}}</slot>
    </li>
    <li v-if="showEmpty" :class="[prefixCls+'-empty']">{{localeNoMatch}}</li>
  </ul>
</div>
</template>
<script>
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import {hasClass,deepCopy,getBarBottom,getScrollBarSize} from '../../util/tools';
  const prefixCls = 'h-select-block';

  export default {
    name: 'Block',
    componentName: 'select-block',
    mixins: [ Emitter,Locale],
    components:{Checkbox},
    props: {
      data:{
        type:Array,
        default:()=>{
          return [];
        }
      },
      itemHeight:{
        type:[Number,String],
        default:30
      }
      // disabled: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data () {
      return {
        prefixCls:prefixCls,
        multiple:false,
        hideMult:false,
        visibleData:[],
        visibleCount:20,
        cloneData:[],
        lastScollTop:0,
        showEmpty:false,
        showBottom:false,
      };
    },
    computed: {
      phantomStl () {
        let style={}
        let curData = this.cloneData.filter((col)=>{return !col.hidden});
        let height = curData.length*30;
        style.height = height+'px';
        return style;
      },
      blockCls(){
        return [
          `${prefixCls}-drop`,
          {
            [`${prefixCls}-multiple`]:this.multiple,
            [`${prefixCls}-show-bottom`]:this.showBottom,
          }
        ]
      },
      localeNoMatch () {       
        return this.t('i.select.noMatch');
      }
    },
    methods: {
      classes (item) {
        return [
          `${prefixCls}-item`,
          {
            [`${prefixCls}-disabled`]: item.disabled||false,
            [`${prefixCls}-selected`]: item.selected||false,
            // [`${prefixCls}-focus`]: item.isFocus,
          }
        ];
      },
      showLabel (item) {
        return (item.label) ? item.label : item.value;
      },
      select (item) {
        if (item.disabled) {
          return false;
        }
        if(this.multiple){
          this.$parent.$parent.selectBlockMultiple(item.value);
        }else{
          this.$parent.$parent.selectBlockSingle(item.value);
        }
      },
      checkChange(val,item){
        this.$parent.$parent.selectBlockMultiple(item.value);
      },
      blur () {
        this.isFocus = false;
      },
      queryChange (val) {
        const parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        let status = true;
        this.cloneData.forEach(col => {
          let hidden = !new RegExp(parsedQuery, 'i').test(col.label);
          this.$set(col,'hidden',hidden)
          if(status&&!hidden){
            status = false;
          }
        });
        this.showEmpty = status;
      },
      handleclick(){ 
      },
      handleBodyScroll(event){
        this.lastScollTop = event.target.scrollTop;
        this.updateVisibleData(event.target.scrollTop);
        let num = getBarBottom(event.target,getScrollBarSize());
        this.$emit('on-scroll',num,this.lastScollTop)
      },
      updateVisibleData(scrollTop) {
        let itemHeight = Number(this.itemHeight);
        scrollTop = scrollTop||this.lastScollTop;
        this.start = Math.floor(scrollTop / itemHeight);
        let i =0
        let j = this.start
        while(i<this.visibleCount){
          if(!this.cloneData[j]){
            i = this.visibleData;
            j = this.cloneData.length;
          }else{
            if(!this.cloneData[j].hidden){
              i++;
            }
            j++;
          }
        }      
        this.end = j;
        this.visibleData = this.cloneData.slice(this.start, this.end);
        this.$refs.content.style.transform = `translate3d(0, ${ this.start * itemHeight }px, 0)`;
      },
    },
    mounted () {
      var str=this.$el.innerText
      this.searchLabel = str.replace('false','').replace('true','').trim();
      // this.searchLabel =str.slice(Number(str.indexOf('</label>')+9));
      this.dispatch('Select', 'append');
      this.$on('on-select-close', () => {
        this.isFocus = false;
      });
      this.$on('on-query-change', (val) => {
        this.queryChange(val);
      });
      this.multiple=this.$parent.$parent.multiple;
      this.showBottom=this.$parent.$parent.showBottom;
      this.cloneData = deepCopy(this.data);
      this.$nextTick(()=>{
        this.visibleCount = Math.ceil(210/Number(this.itemHeight))+1; 
        this.updateVisibleData();
      });
    },
    watch:{
      data:{
        deep:true,
        handler:function(){
          this.$nextTick(()=>{
            this.cloneData = deepCopy(this.data);
          })
        }
      },
      cloneData:{
        deep:true,
        handler:function(val){
          if(val.length==0) this.showEmpty = true;
          this.$nextTick(()=>{
            this.updateVisibleData();
          })
        }
      },
    },
    destroyed () {
      this.dispatch('Select', 'remove');
    }
  };
</script>
