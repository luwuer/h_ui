<template>
  <div>
    <slot name="header">
      <span></span>
      <Button v-if="!isSure" type="ghost" @click="validateData">添加</Button>
      <Button v-if="isSure" type="ghost" @click="modifySure">确认</Button>
    </slot>
    <slot></slot>
    <Table  ref="table" 
      :columns="fColumn" 
      :data="fData" 
      :height="height"
      :stripe="stripe" 
      :border='border'
      :showHeader='showHeader'
      :noDataText="noDataText"
      :canDrag="canDrag"
      :loading="loading"
      highlight-row
      patibleHeight
      @on-row-click="rowClick"></Table>
     <slot name="footer">
    </slot>
  </div>
</template>
<script>
import {deepCopy,typeOf} from '../../util/tools';
import Table from  '../Table/Table.vue';
import Button from  '../Button/Button.vue';
// import FormItem from  '../FormItem.vue';

const prefixCls = 'h-form-gird';

export default {
  name: 'FormGird',
  mixins: [],
  components: {Table,Button},
  props: {
    value:{
      type: Object
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
    uniqueKey:String,
    autoClear:{
      type:Boolean,
      default:false,
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
    noDataText: {
      type: String
    },
    canDrag:{
      type:Boolean,
      default:true
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      fColumn:[{key:'test',title:'测试'}],
      fData:deepCopy(this.data),
      isSure:false,
      curIndex:-1,
      formfield:null,
    };
  },
  computed: {
  },
  methods: {
    validateData(){
      let that = this;
      this.formfield.validate((valid) => {
        if (valid) {           
          that.$hMessage.success('添加成功!');
          that.addData()
        } else {
          that.$hMessage.error('表单验证失败!');
        }
      });
    },
    addData(){
      this.fData.push(deepCopy(this.value));
        if(this.autoClear){
          let curObj = {};
          for(let key in this.value){
            curObj[key] = typeOf(this.value[key]) =='array'?[]:'';
          }
          this.$emit('input',curObj);
        }
    },
    getData(){
      return this.$refs.table.data;
    },
    modifySure(){
      if (this.curIndex==-1) return false;
      this.$set(this.fData,this.curIndex,this.value)
      this.isSure=false;
    },
    rowClick(cur){
      let curObj = cur[0];
      this.curIndex = cur[1];
      this.isSure = true;
      this.$emit('input',curObj);
      this.$emit('on-row-click',cur)
    },
    changeColumn(){
      let column = deepCopy(this.columns);
      column.push({
        title: ' ',
        key: 'delete',
        render:(h,params)=>{
          return h('Button', {
            props: {
              type: 'text'
            },
            nativeOn:{
              'click':()=>{
                event.stopPropagation();
                this.deleteData(params.index);
              }
            }
          },'删除')
        }
      })
      this.fColumn = column;
    },
    deleteData(index){
      let curData = this.fData[index];
      this.fData.splice(index,1);
      this.isSure = false;
      this.curIndex = -1;
      this.$emit('on-delete',curData)
    },
    getAllData(){
      return JSON.parse(JSON.stringify(this.fData));
    }
  },
  watch: {
    column(){
      this.changeColumn();
    },
    data(){
      this.fData = this.data;
    }
  },
  created () {
  },
  mounted(){
    this.changeColumn();
    this.$nextTick(()=>{
      for(let i=0;i<this.$children.length;i++){
        if(this.$children[i].$options.name === 'Form'){
          this.formfield = this.$children[i];
          break;
        }
      }
    })
  }
};
</script>
