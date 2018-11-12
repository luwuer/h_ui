<template>
<div>
    <h1>基本用法</h1>
  <p>data为树型结构</p>
   <h-button type="ghost" @click="exportCsv">导出表格数据</h-button>
   <h-asyc-tree-gird :columns="columns1" :data="data2" :option='options1' :treeOption="treeOption" ref="asyctreegird1" border>
    <p slot="header">我是headerSLOT</p>
  </h-asyc-tree-gird> 
    <p>外部可以在data中设置checked标识当前行节点是否选中(isCheckbox为true时设置)</p>
  <p>外部可以在data中设置leaf标识当前行是否是叶子节点</p>
  <p>外部可以在data中设置expand标识当前行是否展开</p>
  <h-asyc-tree-gird :columns="columns1" :data="data1" size="small" @on-row-click="click2" isCheckbox :load-data = 'loaddataMethod' ref="asyctreegird"></h-asyc-tree-gird>
  <p>父节点expand为false时,父、子节点autoLoad无用</p>
  <h-asyc-tree-gird :columns="columns1" :data="datatest1" size="small" @on-row-click="click2" isCheckbox :load-data = 'loaddataMethod' ref="asyctreegird"></h-asyc-tree-gird> 
  <p>父节点expand为true时,无loading设置时，有子节点则显示子节点</p>
  <h-asyc-tree-gird :columns="columns1" :data="datatest2" size="small" @on-row-click="click2" isCheckbox :load-data = 'loaddataMethod' ref="asyctreegird"></h-asyc-tree-gird>
   <h-button type="ghost" @click="toggleexpand">展开当前节点</h-button>
  <p>外部可以在data中设置loading:false标识当前行节点需要异步加载数据，同时配置loadData(传入单层数据或者tree数据)</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" size="small" @on-row-click="click2" :load-data = 'loaddataMethod'></h-asyc-tree-gird>  
   <h1>测试border</h1>
  <p>是否显示边框</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" :border='false'></h-asyc-tree-gird>
  <h1>测试show-header</h1>
  <p>是否显示表头</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" :show-header='false'></h-asyc-tree-gird>
  <h1>测试width</h1>  
  <p>设置表格宽度</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" width='800'></h-asyc-tree-gird>
  <h1>测试height及on-scroll</h1>    
  <p>设置表格高度</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" height='200' @on-scroll="click2"></h-asyc-tree-gird>
  <h1>测试disabled-hover</h1>      
  <p>禁用鼠标悬停是的高度</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" disabled-hover></h-asyc-tree-gird>
  <h1>测试highlight-row及on-current-change</h1>        
  <p>是否支持高亮选中行(单选)，选中后返回currentRow：当前高亮行的数据及oldCurrentRow：上一次高亮的数据</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" highlight-row @on-current-change='click3'></h-asyc-tree-gird>
  <h1>测试size</h1>        
  <p>设置size为large</p>
  <h-asyc-tree-gird :columns="columns1" :data="data2" highlight-row size="large" @on-current-change='click3'></h-asyc-tree-gird>
  <h1>测试no-data-text</h1>        
  <p>设置no-data-text为'当前树表格为空'</p>
  <h-asyc-tree-gird :columns="columns1" :data="data3" highlight-row size="small" @on-current-change='click3' no-data-text='当前树表格为空'></h-asyc-tree-gird> 
   <h1>测试isCheckbox及on-select-change</h1>        
  <p>是否显示多选框及选中后返回selection：已选项数据,若当前节点设置loading属性(标识异步加载),异步加载完成后才能返回全部子节点,否则返回当前节点</p>
  <h-asyc-tree-gird :columns="columns1" :data="data1" isCheckbox no-data-text='当前树表格为空' @on-select-change="click2"></h-asyc-tree-gird> 
  <h-asyc-tree-gird :columns="columns1" :data="data1" isCheckbox no-data-text='当前树表格为空' @on-select-change="click2" :load-data = 'loaddataMethod'></h-asyc-tree-gird>
  <h1>测试checkStrictly及on-expand</h1>        
  <p>多选模式下多选框是否不联动</p>
  <h-asyc-tree-gird :columns="columns1" :data="data1" isCheckbox no-data-text='当前树表格为空' @on-select-change="click2" checkStrictly @on-expand="click3"></h-asyc-tree-gird>  
  <h1>测试表格loading</h1>        
  <p>表格是否正在加载中</p>
  <h-asyc-tree-gird :columns="columns1" :data="data1" isCheckbox no-data-text='当前树表格为空' @on-select-change="click2" checkStrictly :loading = 'dataLoading'>
  </h-asyc-tree-gird>
  <h-asyc-tree-gird :columns="columns1" :data="data1" isCheckbox no-data-text='当前树表格为空' @on-select-change="click2" checkStrictly :loading = 'dataLoading'>
    <span slot = "loading">正在加载中 -----</span>
  </h-asyc-tree-gird>  
  
</div>
</template>
<script>
  // import {get} from '../api/bizApi/commonUtil'
  var datatest1 = [
    {
      id: 4,
      name: '周小伟4wr44',
      age: 26,
      address: '深圳市南山区深南大道',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      autoLoad: true,
      expand: false,
      children: [{
        id: 41,
        name: '周小伟44422',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-01-09T16:00:00.000Z',
        timing:'16:00:00.00',
        tree:'leaf1',
        loading: false,                
        autoLoad: true,
      }]
    }
  ]
  var datatest2 = [
    {
      id: 7,
      name: '周小伟4wr445555',
      age: 26,
      address: '设置loading,autoload为字符串false',
      money: '不展开',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: 'false',
    },
    {
      id: 7,
      name: '周小伟4wr445555',
      age: 26,
      address: 'autoLoad为true,，设置loading，不设置expand则不展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: true,
    },
    {
      id: 4,
      name: '周小伟4wr44',
      age: 26,
      address: 'autoLoad为true,expand为false，有children',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      autoLoad: true,
      expand: true,
      children: [{
        id: 41,
        name: '周小伟44422',
        age: 26,
        address: '深圳市南山区深南大道',
        money: '150.00',
        cardId: '6223 5678 1234 5678',
        city: '北京',
        dating:'2018-01-09T16:00:00.000Z',
        timing:'16:00:00.00',
        tree:'leaf1',
        loading: false,                
        autoLoad: true,
      }]
    },
    {
      id: 5,
      name: '周小伟4wr445555',
      age: 26,
      address: 'autoLoad为true,expand为false，不设置loading，则加载无效',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      autoLoad: true,
      expand: false
    },{
      id: 6,
      name: '周小伟66asdasda666',
      age: 26,
      address: 'autoLoad为false,设置loading，expand为true则展开无子节点，需要手动点击隐藏再展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,
      autoLoad: false,
      expand: true
    },
    {
      id: 6,
      name: '周小伟66asdasda666',
      age: 26,
      address: 'autoLoad为true,expand为true，正常展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,
      autoLoad: true,
      expand: true
    },
    {
      id: 8,
      name: '周小伟4wr445555sdfsdfsd',
      age: 26,
      address: 'autoLoad为true,，设置loading，expand为false，不展开节点，需要手动展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: true,
      expand: false
    },
    {
      id: 8,
      name: '周小伟4wr445555sdfsdfsd',
      age: 26,
      address: 'autoLoad为false,，设置loading，expand为false，不展开节点，需要手动展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: false,
      expand: false
    },
    {
      id: 9,
      name: '周小伟4wr445555ccccc',
      age: 26,
      address: 'autoLoad为true,，设置loading，expand为true，正常展开',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: true,
      expand: true
    },
    {
      id: 9,
      name: '周小伟4wr445555ccccc',
      age: 26,
      address: 'autoLoad为字符串"true",，设置loading，expand为true',
      money: '150.00',
      cardId: '6223 5678 1234 5678',
      city: '北京',
      dating:'2018-01-09T16:00:00.000Z',
      timing:'16:00:00.00',
      tree:'leaf1',
      _parentId: 1,
      loading: false,                
      autoLoad: "true",
      expand: true
    }
  ]
  var tData= [
        {
          id: 1,
          name: '王小明sds',
          age: 18,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          // tree:'leaf1',
          expand: true,
          children: [
            {
              id: 11,
              name: '张小刚11',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              checked: true,
              // _parentId: 1,
              children: [
                {
                  id: 111,
                  name: '张小刚111222',
                  age: 25,
                  address: '北京市海淀区西二旗',
                  money: '130.00',
                  cardId: '6223 5678 1234 5678',
                  city: '北京',
                  dating:'2018-01-09T16:00:00.000Z',
                  timing:'16:00:00.00',
                  tree:'leaf1',
                  _parentId: 11,
                  children: [
                    {
                      id: 1111,
                      name: '张小刚1111',
                      age: 25,
                      address: '北京市海淀区西二旗',
                      money: '130.00',
                      cardId: '6223 5678 1234 5678',
                      city: '北京',
                      dating:'2018-01-09T16:00:00.000Z',
                      timing:'16:00:00.00',
                      tree:'leaf1',
                      _parentId: 111,
                    },
                    {
                      id: 1112,
                      name: '张小刚121212',
                      age: 25,
                      address: '北京市海淀区西二旗',
                      money: '130.00',
                      cardId: '6223 5678 1234 5678',
                      city: '北京',
                      dating:'2018-01-09T16:00:00.000Z',
                      timing:'16:00:00.00',
                      tree:'leaf1',
                      _parentId: 111,
                    },
                  ]
                },
                {
                  id: 112,
                  name: '张小刚1212',
                  age: 25,
                  address: '北京市海淀区西二旗',
                  money: '130.00',
                  cardId: '6223 5678 1234 5678',
                  city: '北京',
                  dating:'2018-01-09T16:00:00.000Z',
                  timing:'16:00:00.00',
                  tree:'leaf1',
                  _parentId: 11,
                },
              ]
            },
            {
              id: 12,
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              money: '140.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 1,
            },
            {
              id: 13,
              name: '周小伟123',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 1,
            },
          ]
          // _highlight: true//默认选择当前项
        },
        
        {
          id: 2,
          name: '王小明222',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          tree:'leaf1',
          leaf: true,
          children: [
            {
              id: 21,
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
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
              dating:'2018-01-09T16:00:00.000Z',
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
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 2,
            },
          ]
          // _highlight: true//默认选择当前项
        },
        
        {
          id: 3,
          name: '王小明333',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          tree:'leaf1',
          // _highlight: true//默认选择当前项
          children: [
            {
              id: 31,
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
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
              dating:'2018-01-09T16:00:00.000Z',
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
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 3,
            }
          ]
        },
         {
              id: 4,
              name: '周小伟4wr44',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 1,
              autoLoad: true,
            },
  ];
  let tDataSingle = [
        {
          id: 1,
          name: '王小明sds',
          age: 18,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          // tree:'leaf1',
          children: [
            {
              id: 11,
              name: '张小刚11',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              // _parentId: 1,
              children: [
                {
                  id: 111,
                  name: '张小刚111222',
                  age: 25,
                  address: '北京市海淀区西二旗',
                  money: '130.00',
                  cardId: '6223 5678 1234 5678',
                  city: '北京',
                  dating:'2018-01-09T16:00:00.000Z',
                  timing:'16:00:00.00',
                  tree:'leaf1',
                  _parentId: 11,
                  children: [
                    {
                      id: 1111,
                      name: '张小刚1111',
                      age: 25,
                      address: '北京市海淀区西二旗',
                      money: '130.00',
                      cardId: '6223 5678 1234 5678',
                      city: '北京',
                      dating:'2018-01-09T16:00:00.000Z',
                      timing:'16:00:00.00',
                      tree:'leaf1',
                      _parentId: 111,
                    },
                    {
                      id: 1112,
                      name: '张小刚121212',
                      age: 25,
                      address: '北京市海淀区西二旗',
                      money: '130.00',
                      cardId: '6223 5678 1234 5678',
                      city: '北京',
                      dating:'2018-01-09T16:00:00.000Z',
                      timing:'16:00:00.00',
                      tree:'leaf1',
                      _parentId: 111,
                    },
                  ]
                },
                {
                  id: 112,
                  name: '张小刚1212',
                  age: 25,
                  address: '北京市海淀区西二旗',
                  money: '130.00',
                  cardId: '6223 5678 1234 5678',
                  city: '北京',
                  dating:'2018-01-09T16:00:00.000Z',
                  timing:'16:00:00.00',
                  tree:'leaf1',
                  _parentId: 11,
                },
              ]
            },
            {
              id: 12,
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              money: '140.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 1,
            },
            {
              id: 13,
              name: '周小伟123',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
            },
          ]
          // _highlight: true//默认选择当前项
        },
        
        {
          id: 2,
          name: '王小明222',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          tree:'leaf1',
          leaf: true,
          children: [
            {
              id: 21,
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
            },
            {
              id: 22,
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              money: '140.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
            },
            {
              id: 23,
              name: '周小伟',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 2,
            },
          ]
          // _highlight: true//默认选择当前项
        },
        
        {
          id: 3,
          name: '王小明333',
          age: 21,
          address: '北京市朝阳区芍药居',
          money: '120.00',
          cardId: '6223 5678 1234 5678',
          city: '北京',
          dating:'2018-01-09T16:00:00.000Z',
          timing:'16:00:00.00',
          tree:'leaf1',
          // _highlight: true//默认选择当前项
          children: [
            {
              id: 31,
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              money: '130.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
            },
            {
              id: 32,
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              money: '140.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
            },
            {
              id: 33,
              name: '周小伟',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              _parentId: 3,
            }
          ]
        },
         {
              id: 4,
              name: '周小伟444',
              age: 26,
              address: '深圳市南山区深南大道',
              money: '150.00',
              cardId: '6223 5678 1234 5678',
              city: '北京',
              dating:'2018-01-09T16:00:00.000Z',
              timing:'16:00:00.00',
              tree:'leaf1',
              loading: false,
              autoLoad: true
            },
  ];
  export default {
    data () {
        return {
          datatest1: datatest1,
          datatest2: datatest2,
          options1:[],
          treeOption:[],
          columns1: [
              {
                type: 'text',
                title: '姓名',
                key: 'name',
                width: 300,
                ellipsis:true,
              },
              {
                type: 'text',
                title: '年龄',
                width: 200,
                key: 'age',
                // hiddenCol:true,
              },
              {
                type: 'textArea',
                rows: 2,
                width: 100,
                title: '地址',
                key: 'address',
                ellipsis:true,
                rule: {
                   required: true, 
                   message: '输入不能为空'
                }
              },
              {
                type: 'money',
                title: '金额',
                width: 200,
                integerNum: 1,
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
                width: 100,
                key: 'dating',
                dateType:'date',
                format: 'yyyy-MM-dd',
                ellipsis:true,
              },
              {
                type: 'time',
                title: '时间',
                width: 200,
                key: 'timing',
                dateType:'time',
                format: 'HH:mm:ss',
                steps: [2,2,2],
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
          data1: tData,
          data2: tDataSingle,
          data3: [],
          dataLoading: true,
          current: []
        }
    },
    methods: {
      exportCsv () {
        this.$refs.asyctreegird1.exportCsv({
                        filename: '原始数据'
                    })
      },
      click2(s){
        this.current = s
        console.log(s);
      },
      click3(s, y){
        console.log(s);
        console.log(y);
      },
      loaddataMethod (item, callback) {
        // get('/getTreeGridData').then(res => {
        //   callback(res.data);
        // })
      },
      toggleexpand () {
        this.$refs.asyctreegird.toggleExpand(this.current[1], this.current[0])
      }
    },
    mounted(){
      this.options1[4]=[{value:'Alabama',label:'Alabama'},{value:'北京',label:'北京'},{value:'Delaware',label:'Delaware'}];
      this.treeOption[7]=[{
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
<style>
  /* .h-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 16px;
    height: 14px;
} */
</style>