<template>
<div>   
  <h1>SimpleSelect组件</h1>
  <p>选择器支持单选、多选、搜索，以及键盘快捷操作。</p>
  <h1>selectBlock测试用例</h1>
  <h-simple-select v-model="value" ref="test" placement="bottom-start" filterable :clearable="false" label-in-value @on-change="change" showBottom>
    <h-select-block :data="bigData" @on-scroll="select"></h-select-block>
  </h-simple-select>
  <h-simple-select v-model="value" transfer placement="bottom-start" filterable placeholder="123" isArrow=false>
    <h-select-block :data="bigData" style="width:200px;"></h-select-block>
  </h-simple-select>
  <h-simple-select v-model="value1" multiple ref="test" placement="top-start" filterable checkToHead showBottom @on-change="change">
    <h-select-block :data="bigData" ></h-select-block>
  </h-simple-select>
  {{value1}}

</div>
</template>
<script>
let bigData = [];
for(let i=0;i<6000;i++){
  let obj={};
  obj.value="value"+i;
  obj.label="label"+i;
  bigData.push(obj);
}

export default {
  data () {
    return {
      matchCol:['name','age'],
      bigData:bigData,
      value:'value0',
      value1:['value0'],
      value2:'',
    }
  },
  methods: {
    testClick(val){
      if (val) {
        this.$refs.test.focus();
      }else{
        this.$refs.test.blur();
      }
    },
    ceshi(){
      this.model1 = [];
      this.model2 = '';
    },
    change(e){
      console.log(e);
    },
    select(e,b){
      console.log(e);
      console.log(b);
    },
    allSelect(e){
      console.log(e);
    },
    selsetChange(e){
      console.log(e);
    },
    scroll(num){
      console.log(num);
      let _this = this;
      if (num<=1 && _this.canPage) {
          _this.canPage = false;
          setTimeout(() => {
            console.log(_this.index);
              if (_this.index==0) {
                  _this.data1=_this.data1.concat(cdata);
                  _this.canPage = true;
                  _this.index =1;
              }else{
                  this.isComputed = true;
              }
          }, 200);
      }
    }

  },
  mounted(){
  },
  watch:{
    data1(val){
    }
  }
}
</script>
<style>
    p{
        font-size: 18px;
    }
</style>