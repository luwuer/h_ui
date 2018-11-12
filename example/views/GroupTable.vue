<template>
  <div>
    <h2>基础</h2>
    <h3>单选分组组件</h3>
    <h-group-table :columns="columns1" :height="300" :data="data1" size="large" :highlight-row="true" @on-current-change="click1" ref="groupTable" width="800" :loading="loading">
      <P slot="loading">我是自定义de</P>
    </h-group-table>
    <Button @click="setLoad">切换loading</Button>
    <h-group-table :columns="columns1" :data="data1" @on-row-click="click1" :loading="loading"></h-group-table>
      <h-group-table :columns="columns1" :data="data1" size="small" :disabled-hover="true" :highlight-row="true" @on-current-change="click1" stripe :loading="loading"></h-group-table>
      <h-group-table :columns="columns1" :data="[]" no-data-text="哎呀你好" :loading="loading"></h-group-table>
      <Button @click="getDate">获取数据</Button>
      <h3>多选分组组件</h3>
      <h-group-table :columns="columns4" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange" :loading="loading"></h-group-table>
      <h-group-table :columns="columns4" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange" :loading="loading"></h-group-table>
  </div>
</template>

<script>
import TexpandRow from './Texpand-row.vue'
var tData= [
  {
    title:'分组表格数据：group1【项目编号：45424451114】 共计：3项',
    // expand:true,
    item:[
      {
        name: '王小明',
        age: 18,
        address: '北京市朝阳区芍药居',
        money: '120.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
        // _highlight: true//默认选择当前项
      },
      {
        name: '张小刚',
        age: 25,
        address: '北京市海淀区西二旗',
        money: '130.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '李小红',
        age: 30,
        address: '上海市浦东新区世纪大道',
        money: '140.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '周小伟',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      }
    ]
  },
  {
    title:'分组表格数据：group2【项目编号：45424451114】 共计：3项',
    item:[
      {
        name: '王小明',
        age: 18,
        address: '北京市朝阳区芍药居',
        money: '120.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
        // _highlight: true//默认选择当前项
      },
      {
        name: '张小刚',
        age: 25,
        address: '北京市海淀区西二旗',
        money: '130.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '李小红',
        age: 30,
        address: '上海市浦东新区世纪大道',
        money: '140.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '周小伟',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      }
    ]
  },
  {
    title:'分组表格数据：group3【项目编号：45424451114】 共计：3项',
    item:[
      {
        name: '王小明',
        age: 18,
        address: '北京市朝阳区芍药居',
        money: '120.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
        // _highlight: true//默认选择当前项
      },
      {
        name: '张小刚',
        age: 25,
        address: '北京市海淀区西二旗',
        money: '130.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '李小红',
        age: 30,
        address: '上海市浦东新区世纪大道',
        money: '140.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '周小伟',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      }
    ]
  },
  {
    title:'分组表格数据：group4【项目编号：45424451114】 共计：3项',
    item:[
      {
        name: '王小明',
        age: 18,
        address: '北京市朝阳区芍药居',
        money: '120.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
        // _highlight: true//默认选择当前项
      },
      {
        name: '张小刚',
        age: 25,
        address: '北京市海淀区西二旗',
        money: '130.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '李小红',
        age: 30,
        address: '上海市浦东新区世纪大道',
        money: '140.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      },
      {
        name: '周小伟',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-03-07',
        timing:'16:00:00.00',
        tree:'leaf1'
      }
    ]
  }
];
export default {
  components:{TexpandRow},
  data() {
    return {
      loading:false,
      columns1: [
        {
          title: '姓名',
          key: 'name',
          width: 200,
          render:(h,params)=>{
            return h('span',[
              h('Icon', {
                props: {
                    name: 'person'
                }
              }),
            ])
          }
        },
        {
          title: '年龄',
          width: 200,
          key: 'age',
        },
        {
          title: '地址',
          width: 200,
          key: 'address',
        },
        {
          title: '金额',
          key: 'money',
        },
        // {
        //   title: '卡号',
        //   width: 200,
        //   key: 'cardId',
        // },
        // {
        //   title: '地区',
        //   width: 200,
        //   key: 'city',
        // },
        // {
        //   title: '日期',
        //   width: 200,
        //   key: 'dating',
        // },
        // {
        //   title: '时间',
        //   width: 200,
        //   key: 'timing',
        // },
        // {
        //   title: '下拉树',
        //   key: 'tree',
        // }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          type: 'text',
          title: '姓名',
          key: 'name',
          width: 200
        },
        {
          type: 'number',
          title: '年龄',
          width: 200,
          key: 'age',
        },
        {
          type: 'textArea',
          rows: 2,
          width: 200,
          title: '地址',
          key: 'address',
        },
        {
          type: 'money',
          title: '金额',
          width: 200,
          integerNum: 3,
          suffixNum: 2,
          bigTips: true,
          key: 'money',
        },
        {
          type: 'card',
          title: '卡号',
          width: 200,
          key: 'cardId',
        },
        {
          type: 'select',
          title: '地区',
          width: 200,
          key: 'city',
          multiple:false,
          option: [
              {value:"北京"},
              {value:"上海"},
              {value:"天津"},
              {value:"沈阳"},
              {value:"杭州"},
              {value:"武汉"},
          ],
        },
        {
          type: 'date',
          title: '日期',
          width: 200,
          key: 'dating',
          dateType:'date',
          format: 'yyyy-MM-dd'
        },
        {
          type: 'time',
          title: '时间',
          width: 200,
          key: 'timing',
          dateType:'time',
          format: 'HH:mm:ss',
          steps: [],
        },
        {
          type: 'selectTree',
          title: '下拉树',
          width: 200,
          key: 'tree',
          treeData:[{
            expand: true,
            selected:true,
            title: 'parent 1',
            children: [{
              title: 'parent 1-0',
              expand: true,
              children: [{
                title: 'leaf1',
                disableCheckbox: true
              }, {
                title: 'leaf2',
              }]
            }, {
              title: 'parent 1-1',
              expand: true,
              checked: true,
              children: [{
                title: 'leaf3',
              }]
            }]
          }],
          showCheckbox: false,
          checkStrictly: false,
        }
      ],
      data1: tData
    }
  },
  methods: {
    setLoad(){
      this.loading = !this.loading;
    },
    click1(s){
      console.log(s);
    },
    allSelect (allSelection){
      console.log(allSelection);
    },
    select (selection,row){//已选择的项和刚刚选择的项
      console.log(selection);
      console.log(row);
    },
    selsetChange (selection){//选项发生变化时触发已选择的项
      console.log(selection);
    },
    getDate(){
      console.log(this.$refs.groupTable.cloneData); 
    },
    addDate(){
      tData = this.data1.push({
        name: '',
        age: null,
        address: '',
        money: '',
        cardId: '',
        city: '',
        dating:'',
        timing:'',
        tree:''
      });
    }  
  } 
}
</script>
<style>
/* .h-editgird .h-editgird-cell-with-render .dbClass{display:none;} */
</style>
