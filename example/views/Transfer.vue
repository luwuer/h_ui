<template>
  <div>
    <h1>理财5.0</h1>
    <h-transfer
      :data="data0"
      :target-keys="targetKeys0"   
      contentSplit 
      filterable
    >
      <span slot="footer"> 124</span>
    </h-transfer>
    <p>概述：双栏穿梭选择框，常用于将多个项目从一边移动到另一边</p>
    <p><i>:data：总体数据，数组，每项为一个对象，且必须含有 key 值，组件基于此做索引。</i><br>
      <i>:target-keys：目标列索引集合，数组，每项为数据的 key 值，Transfer 会将含有这些 key 值的数据筛选到右边。</i><br>
      <i>:render-format：每行数据显示的格式函数，默认优先显示 label 值，没有时显示 key 值，可以自己组合出需要的数据格式。</i><br>
      <i>@on-change：当点击转移按钮时，组件本身并不会转移数据，而是触发事件，由用户来操作数据。</i>
    </p>
    <h2>基本用法</h2>
    <h-transfer
      :data="data1"
      :target-keys="targetKeys1"
      :render-format="render1"
      @on-change="handleChange1">
      1245
      <span slot="footer"> 124</span>
      <span slot="operation"><h-button>我是自定义操作</h-button></span>
    </h-transfer>
    <h2>搜索</h2>
    <p>通过设置属性 filterable 可以进行搜索，可以自定义搜索函数</p>
    <h-transfer
      :data="data2"
      :target-keys="targetKeys2"
      filterable
      :filter-method="filterMethod"
      @on-change="handleChange2">
        12342412<br>12342412<br>12342412<br>
      </h-transfer>

    <h2>高级用法</h2>
    <p>穿梭框高级用法，可以自定义两列的宽高、操作文案，以及底部自定义操作，更多配置见 API。</p>
    <!-- <h-transfer
      :data="data3"
      :target-keys="targetKeys3"
      :list-style="listStyle"
      :render-format="render3"
      :operations="['向左移动','向右移动']"
      filterable
      :filter-method="filterMethod"
      @on-change="handleChange3">
      <div :style="{float: 'right', margin: '5px'}">
          <h-button type="ghost" size="small" @click="reloadMockData">刷新</h-button>
      </div>
    </h-transfer> -->

  </div>
</template>
<script>
  export default {
    data () {
      return {
        data0:this.getMockData(),
        targetKeys0:[],
        data1: this.getMockData(),
        targetKeys1: this.getTargetKeys(),
        data2: this.getMockData(),
        targetKeys2: this.getTargetKeys(),
        data3: this.getMockData(),
        // targetKeys3: this.getTargetKeys(),
        targetKeys3: [],
        listStyle: {
          width: '250px',
          height: '300px'
        }
      }
    },
    methods: {
      getMockData () {
        let mockData = [];
        for (let i = 1; i <= 20; i++) {
          mockData.push({
            key: i.toString(),
            label: '内容' + i,
            description: '内容' + i + '的描述信息',
            // disabled: Math.random() * 3 < 1
          });
        }
        return mockData;
      },
      getTargetKeys () {
        return this.getMockData()
          .filter(() => Math.random() * 2 > 1)//arr.filter()实质删选返回值为true的项
          .map(item => item.key);
      },
      render1 (item) {
        return item.label;
        //自定义渲染数据列
        // return item.label + ' - ' + item.description;
      },
      handlechnage0(newTargetKeys, direction, moveKeys){
        this.targetKeys0 = newTargetKeys;
      },
      handleChange1 (newTargetKeys, direction, moveKeys) {
        console.log(newTargetKeys);
        console.log(direction);
        console.log(moveKeys);
        this.targetKeys1 = newTargetKeys;
      },
      handleChange2 (newTargetKeys) {
        this.targetKeys2 = newTargetKeys;
      },
      filterMethod (data, query) {
        return data.label.indexOf(query) > -1;
      },
      handleChange3 (newTargetKeys) {
        this.targetKeys3 = newTargetKeys;
      },
      render3 (item) {
        return item.label + ' - ' + item.description;
      },
      reloadMockData () {
        this.data3 = this.getMockData();
        this.targetKeys3 = this.getTargetKeys();
      }
      
    },
    mounted () {
      // this.updateTree(this.baseData);
    }
  }
</script>