<template>
  <div>
    <h2>基础用法 </h2>
    <h-page :total="val" @on-change="pageChange" class-name="wrap" :current="curPage" fastArrival></h-page>
    <h-button @click="pageChange1">改变当前page</h-button>
    <br>
    <Button @click="setTotal">设置total为0</Button>
    <p>自定义某页数量</p>
    <h-page :total="100" :pageSize='5' show-custom  placement="top" @on-page-size-change="numChange"></h-page>
    <p>显示每页数量</p>
    <h-page :total="100" :pageSize='40' show-sizer @on-page-size-change="numChange" placement="top" :pageSizeOpts="pageSizeOpts"></h-page>
    <p>快速跳转到某一页</p>
    <h-page :total="100" show-elevator :isBlur="true"></h-page>
    <p>显示总数</p>
    <h-page :total="100" show-total></h-page>
    <p>迷你型</p>
    <h-page :total="40" size="small"></h-page>
    <h-page :total="40" size="small" show-elevator show-sizer></h-page>
    <h-page :total="40" size="small" show-total></h-page>
    <p>简洁版</p>
    <h-page :current="2" :total="50" simple></h-page>
    <h-page :current="2" :total="50" simple isBlur></h-page>
  	<h2>分页表格</h2>
    <p>结合表格组件和分页组件以及表单组件</p>
    <div class="pageTable">
      <h-button-group>
        <h-button type="ghost" @click="addData('add')">增加</h-button>
        <h-button type="ghost" @click="reviseData">修改</h-button>
        <h-button type="ghost" @click="deleteData">删除</h-button>
        <h-button type="ghost" @click="addData('search')">查询</h-button>
        <h-button type="ghost" @click="refreshData">刷新</h-button>
      </h-button-group>
      </br>
      </br>
      <h-table :data="tData" :columns="columns" @on-row-click="rowClick"></h-table>
      </br>
      <h-page :total="totalNum" @on-change="dataChange" show-sizer show-elevator show-total @on-page-size-change="pickerChange" :pageSizeOpts="pageSizeOpts"></h-page>
    </div>
    <h-msg-box v-model="addMsg" width="800" >
      <p slot="header">
        <span v-if="type=='add'">增加</span>
        <span v-if="type=='revise'">修改</span>
        <span v-if="type=='search'">查询</span>
      </p>
      <h-form v-model="addForm" label-position="right" :label-width="80">  
        <h-row>
          <h-col span="12">
            <h-form-item :label="columns[0].title" :rules="userValid" required>
              <h-input v-model="addForm.name"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[1].title" required>
              <h-input v-model="addForm.show"></h-input>
            </h-form-item>
            <h-form-item :label="columns[2].title">
              <h-input v-model="addForm.weak"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[3].title">
              <h-input v-model="addForm.signin"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[4].title">
              <h-input v-model="addForm.click"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[5].title">
              <h-input v-model="addForm.active"></h-input>
            </h-form-item>    
          </h-col>
          <h-col span="12">
            <h-form-item :label="columns[6].title">
              <h-input v-model="addForm.day7"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[7].title">
              <h-input v-model="addForm.day30"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[8].title">
              <h-input v-model="addForm.tomorrow"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[9].title">
              <h-input v-model="addForm.day"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[10].title">
              <h-input v-model="addForm.week"></h-input>
            </h-form-item>    
            <h-form-item :label="columns[11].title">
              <h-input v-model="addForm.month"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
      </h-form>
      <div slot="footer">
        <h-button  @click="addCancle">取消</h-button>
        <h-button v-if="type=='add'" type="primary" @click="addOk">新增</h-button>
        <h-button v-if="type=='revise'" type="primary" @click="reviseOk">修改</h-button>
        <h-button v-if="type=='search'" type="primary" @click="searchOk">查询</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  var data = [
    {
      "name": "推广名称1",
      "fav": 0,
      "show": 7302,
      "weak": 5627,
      "signin": 1563,
      "click": 4254,
      "active": 1438,
      "day7": 274,
      "day30": 285,
      "tomorrow": 1727,
      "day": 558,
      "week": 4440,
      "month": 5610
    },
    {
      "name": "推广名称2",
      "fav": 0,
      "show": 4720,
      "weak": 4086,
      "signin": 3792,
      "click": 8690,
      "active": 8470,
      "day7": 8172,
      "day30": 5197,
      "tomorrow": 1684,
      "day": 2593,
      "week": 2507,
      "month": 1537
    },
    {
      "name": "推广名称3",
      "fav": 0,
      "show": 7181,
      "weak": 8007,
      "signin": 8477,
      "click": 1879,
      "active": 16,
      "day7": 2249,
      "day30": 3450,
      "tomorrow": 377,
      "day": 1561,
      "week": 3219,
      "month": 1588
    },
    {
      "name": "推广名称4",
      "fav": 0,
      "show": 9911,
      "weak": 8976,
      "signin": 8807,
      "click": 8050,
      "active": 7668,
      "day7": 1547,
      "day30": 2357,
      "tomorrow": 7278,
      "day": 5309,
      "week": 1655,
      "month": 9043
    },
    {
      "name": "推广名称5",
      "fav": 0,
      "show": 934,
      "weak": 1394,
      "signin": 6463,
      "click": 5278,
      "active": 9256,
      "day7": 209,
      "day30": 3563,
      "tomorrow": 8285,
      "day": 1230,
      "week": 4840,
      "month": 9908
    },
    {
      "name": "推广名称6",
      "fav": 0,
      "show": 6856,
      "weak": 1608,
      "signin": 457,
      "click": 4949,
      "active": 2909,
      "day7": 4525,
      "day30": 6171,
      "tomorrow": 1920,
      "day": 1966,
      "week": 904,
      "month": 6851
    },
    {
      "name": "推广名称7",
      "fav": 0,
      "show": 5107,
      "weak": 6407,
      "signin": 4166,
      "click": 7970,
      "active": 1002,
      "day7": 8701,
      "day30": 9040,
      "tomorrow": 7632,
      "day": 4061,
      "week": 4359,
      "month": 3676
    },
    {
      "name": "推广名称8",
      "fav": 0,
      "show": 862,
      "weak": 6520,
      "signin": 6696,
      "click": 3209,
      "active": 6801,
      "day7": 6364,
      "day30": 6850,
      "tomorrow": 9408,
      "day": 2481,
      "week": 1479,
      "month": 2346
    },
    {
      "name": "推广名称9",
      "fav": 0,
      "show": 567,
      "weak": 5859,
      "signin": 128,
      "click": 6593,
      "active": 1971,
      "day7": 7596,
      "day30": 3546,
      "tomorrow": 6641,
      "day": 1611,
      "week": 5534,
      "month": 3190
    },
    {
      "name": "推广名称10",
      "fav": 0,
      "show": 3651,
      "weak": 1819,
      "signin": 4595,
      "click": 7499,
      "active": 7405,
      "day7": 8710,
      "day30": 5518,
      "tomorrow": 428,
      "day": 9768,
      "week": 2864,
      "month": 5811
    },
    {
      "name": "推广名称11",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称12",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称13",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称14",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称15",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称16",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称17",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称18",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称19",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称20",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称21",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称22",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    },
    {
      "name": "推广名称23",
      "fav": 0,
      "show": 3650,
      "weak": 1818,
      "signin": 4596,
      "click": 7500,
      "active": 7406,
      "day7": 8716,
      "day30": 5519,
      "tomorrow": 427,
      "day": 9767,
      "week": 2865,
      "month": 5814
    }
  ];
  var columns = [
    {
      title: "名称",
      key: "name",
      fixed: "left",
      width: 200
    },
    {
      title: "展示",
      key: "show",
      width: 150,
      sortable: true,
      filters: [
        {
          label: '大于4000',
          value: 1
        },
        {
          label: '小于4000',
          value: 2
        }
      ],
      filterMultiple: false,
      filterMethod (value, row) {
        if (value === 1) {
          return row.show > 4000;
        } else if (value === 2) {
          return row.show < 4000;
        }
      }
    },
    {
      title: "唤醒",
      key: "weak",
      width: 150,
      sortable: true,
    },
    {
      title: "登录",
      key: "signin",
      width: 150,
      sortable: true
    },
    {
      title: "点击",
      key: "click",
      width: 150,
      sortable: true
    },
    {
      title: "激活",
      key: "active",
      width: 150,
      sortable: true
    },
    {
      title: "7日留存",
      key: "day7",
      width: 150,
      sortable: true
    },
    {
      title: "30日留存",
      key: "day30",
      width: 150,
      sortable: true
    },
    {
      title: "次日留存",
      key: "tomorrow",
      width: 150,
      sortable: true
    },
    {
      title: "日活跃",
      key: "day",
      width: 150,
      sortable: true
    },
    {
      title: "周活跃",
      key: "week",
      width: 150,
      sortable: true
    },
    {
      title: "月活跃",
      key: "month",
      width: 150,
      sortable: true
    }
  ];
  export default {
  	data(){
      var item = {}
      columns.forEach((e,i)=>{
        var key = e.key;
        item.key = '';
      })
  		return {
        curPage:1,
        val:100,
  			tData:data.slice(0,10),
  			columns:columns,
  			totalNum:data.length,
        pageSizeOpts:[10,20,30,40],
        pickerNum:10,
        type:null,
        addMsg:false,
        reviseMsg:false,
        deleteMsg:false,
        searchMsg:false,
        addForm: item,
        currentInx:null,
        currentPage:1,
        userValid: [
          { required: true, message: '请输名称', trigger: 'blur' },
          { type: 'string', min: 6, message: '介绍不能少于6字', trigger: 'change' }
        ]
  		}
  	},
    computed:{
    },
  	methods:{
      pageChange1(){
        this.curPage++;
      },
      setTotal(){
        this.val = 0;
      },
      pickerChange(num){
        this.pickerNum = num;
        this.tData=data.slice(0,num);
      },
      change(val){console.log(this.addForm.show)},
  		dataChange(i){
        this.currentPage = i;
        var num = this.pickerNum;
  			this.tData=data.slice((i-1)*num,i*num);
  		},
      addCancle(){
        this.addMsg = false;
        this.type=null;
      },
      addOk(){
        var items = {}
        if(this.addForm.name&&this.addForm.name!=''&&this.addForm.show&&this.addForm.show!=''){
          items =  JSON.parse(JSON.stringify(this.addForm));
          items.fav=0,
          data.unshift(items);
          this.tData=data.slice(0,this.pickerNum);
          this.addMsg = false;
          this.type=null;
        }else{
          this.$hMessage.info("请填写必填项");
        }
      },
      reviseOk(){
        var index = (this.currentPage-1)*this.pickerNum+this.currentInx;
        var i = this.currentPage,num = this.pickerNum;
        if(this.addForm.name&&this.addForm.name!=''&&this.addForm.show&&this.addForm.show!=''){
          var items =  JSON.parse(JSON.stringify(this.addForm));
          items.fav=0,
          data[index] = items;
          console.log(i)
          console.log(num)
          this.tData=data.slice((i-1)*num,i*num);
          this.addMsg = false;
          this.type=null;
        }else{
          this.$hMessage.info("请填写必填项");
        }
      },
      searchOk(){
        if (this.addForm.name&&this.addForm.name!='') {
          var str = this.addForm.name;
          var arr = [];
          data.forEach((v,i)=>{
            console.log(v.name);
            console.log(str);
            if (v.name.indexOf(str)!=-1) {
              arr.push(v);
            }
          })
          this.totalNum=arr.length;
          this.tData=arr;
          this.type = null;
          this.addMsg=false;
        }else{
          this.$hMessage.info("请输入查询的name")
        }
      },
      reviseData(){
        if (this.currentInx!=null&&this.currentInx>=0) {
          var index = (this.currentPage-1)*this.pickerNum+this.currentInx
          var items = data[index];
          for(var e in items){
            this.addForm[e] = items[e]||'';
          }
          this.type = "revise";
          this.addMsg = true;
        }else{
          this.$hMessage.info('请点击选择表格中的一项')
        }
      },
      deleteData(){
        if (this.currentInx!=null&&this.currentInx>=0) {
          var index = (this.currentPage-1)*this.pickerNum+this.currentInx
          var i = this.currentPage,num = this.pickerNum;
          this.$hMsgBox.confirm({
            title: '确认对话框标题',
            content: '<p>你确定删除此项吗？</p>',
            onOk: () => {
              data.splice(index,1);
              this.tData=data.slice((i-1)*num,i*num);
            },
            onCancel: () => {
            }
          });
        }else{
          this.$hMessage.info('请点击选择表格中的一项')
        }
      },
      addData(str){
        this.type = str;
        this.addMsg = true;
        for(var e in this.addForm){
          this.addForm[e]='';
        }
      },
      refreshData(){
        this.tData = data.slice(0,this.pickerNum);
        this.$hMessage.info('当前表格数据已经刷新');
      },
      rowClick(arr){
        // console.log(data);
        this.currentInx = arr[1];
        var index = (this.currentPage-1)*this.pickerNum+this.currentInx;
        var i = this.currentPage,num = this.pickerNum;
        data.forEach(v=>{
          if(!!v._highlight){
            v._highlight=false;
          }
        })
        data[index]._highlight =true;
        this.tData=data.slice((i-1)*num,i*num);
      },
      pageChange(index){
        console.log(index);
      },
      numChange(value){
        console.log(value)
      },
  	}
  }
</script>
<style type="text/css" scoped>
.wrap{
  background-color: red;
}
</style>