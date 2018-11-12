<template>
  <div>
   <h-tree-gird :columns="columns1" :data="data1" size="small" :highlight-row="true" @on-current-change="click1" @on-row-click="click2" ref="editGird" height="200" :loading="loading" :option="options1" :treeOption="treeOption"></h-tree-gird>
   <Button @click="setLoad">切换loading</Button>
  </div>
</template>
<script>
  var tData= [
        {
          id: 1,
          name: '王小明',
          age: '',
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          expand:true,
          // _highlight: true//默认选择当前项
        },
        {
          id: 11,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 1,
        },
        {
          id: 111,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 11,
        },
        {
          id: 1111,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 111,
        },
        {
          id: 1112,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 111,
        },
        {
          id: 112,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 11,
        },
        {
          id: 12,
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          money: '140.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 1,
        },
        {
          id: 13,
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          money: '150.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 1,
        },
        {
          id: 2,
          name: '王小明',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          // _highlight: true//默认选择当前项
        },
        {
          id: 21,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 2,
        },
        {
          id: 22,
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          money: '140.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 2,
        },
        {
          id: 23,
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          money: '150.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 2,
        },
        {
          id: 3,
          name: '王小明',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          // _highlight: true//默认选择当前项
        },
        {
          id: 31,
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          money: '130.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 3,
        },
        {
          id: 32,
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          money: '140.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 3,
        },
        {
          id: 33,
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          money: '150.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-03-07',
          timing:'16:00:00.00',
          tree:'leaf1',
          _parentId: 3,
        },
      ];
  export default {
    data () {
      return {
        loading:false,
        options1:[],
        treeOption:[],
        columns1: [
          // {
          //   type: 'selection',
          //   width: 120,  
          // },
          {
            // type: 'text',
            title: '姓名',
            key: 'name',
            width: 200
          },
          {
            type: 'number',
            title: '年龄',
            width: 200,
            key: 'age',
            hiddenCol:false,
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
        data1:[ {
          id: 1,
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
        }],
      }
    },
    methods: {
      setLoad(){
        this.data1 = tData;
        // this.loading = !this.loading;
      },
      click1(s){
        console.log(s);
      },
      click2(s){
        console.log(s);
      },

    },
    mounted () {
      this.options1[6]=[{value:'Alabama',label:'Alabama'},{value:'beijing',label:'北京'},{value:'Delaware',label:'Delaware'}]
      this.treeOption[9]=[{
              expand: true,
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
            }]
    }
  }
</script>