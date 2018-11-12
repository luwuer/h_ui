<template>
  <div>
    <h2>基本用法</h2>
    {{val}}
    <h-tabs v-model="val" panelRight :height="200" :labelWidth="15" alginDre="left">
      <h-tab-pane label="标签一" name="name1">
        <h-select v-model="model6" style="width:200px" :transfer="true">
         <h-option value="beijing">北京市</h-option>
         <h-option value="shanghai" >上海市</h-option>
         <h-option value="shenzhen">深圳市</h-option>
        </h-select>
        <h-select v-model="model6" style="width:200px" :transfer="true">
         <h-option value="beijing">北京市</h-option>
         <h-option value="shanghai" >上海市</h-option>
         <h-option value="shenzhen">深圳市</h-option>
        </h-select>
      </h-tab-pane>
      <h-tab-pane label="标签二" name="name2">
        <h-tooltip content="Top Left 文字提示" placement="bottom" :transfer="true">
            <h-button>上左</h-button>
        </h-tooltip>
          <h-table :columns="columns1" :data="data1">
            <span slot="loading">我是自定义加载！！！</span>
          </h-table>
      </h-tab-pane>
      <h-tab-pane label="标签三" name="name3">
        <h-poptip title="提示标题" content="提示内容" placement="bottom" :transfer="true">
            <h-button>左下</h-button>
        </h-poptip>
      </h-tab-Pane>
    </h-tabs>
    <h-tabs v-model="val" panelRight :height="200" :labelWidth="25" alginDre="right">
      <h-tab-pane label="标签一" name="name1">
        <h-select v-model="model6" style="width:200px" :transfer="true">
         <h-option value="beijing">北京市</h-option>
         <h-option value="shanghai" >上海市</h-option>
         <h-option value="shenzhen">深圳市</h-option>
        </h-select>
        <h-select v-model="model6" style="width:200px" :transfer="true">
         <h-option value="beijing">北京市</h-option>
         <h-option value="shanghai" >上海市</h-option>
         <h-option value="shenzhen">深圳市</h-option>
        </h-select>
      </h-tab-pane>
      <h-tab-pane label="标签二" name="name2">
        <h-tooltip content="Top Left 文字提示" placement="bottom" :transfer="true">
            <h-button>上左</h-button>
        </h-tooltip>
          <h-table :columns="columns1" :data="data1">
            <span slot="loading">我是自定义加载！！！</span>
          </h-table>
      </h-tab-pane>
      <h-tab-pane label="标签三" name="name3">
        <h-poptip title="提示标题" content="提示内容" placement="bottom" :transfer="true">
            <h-button>左下</h-button>
        </h-poptip>
      </h-tab-Pane>
    </h-tabs>
    <h2>禁用</h2>
    <h-tabs>
      <h-tab-pane label="标签一" name="name1">
        <h-select-tree v-model="val1" style="width:200px" :data="baseData" showCheckbox size="large" @on-check-change="selectChange" :transfer="true"></h-select-tree>
      </h-tab-pane>
      <h-tab-pane label="标签二" name="name2" disabled>标签二的内容</h-tab-pane>
      <h-tab-pane label="标签三" name="name3" :transfer="true">
        <h-dropdown style="margin-left: 20px" trigger="click" :transfer="true">
          <h-button type="primary">
            下拉菜单
            <h-icon name="arrowdownb"></h-icon>
          </h-button>
          <h-dropdown-menu slot="list">
            <h-dropdown-item>驴打滚</h-dropdown-item>
            <h-dropdown-item>炸酱面</h-dropdown-item>
            <h-dropdown-item disabled>豆汁儿</h-dropdown-item>
            <h-dropdown-item>冰糖葫芦</h-dropdown-item>
            <h-dropdown-item divided>北京烤鸭</h-dropdown-item>
          </h-dropdown-menu>
        </h-dropdown>
        <br><br>
      </h-tab-Pane>
    </h-tabs>
    <h2>图标</h2>
    <h-tabs>
      <h-tab-pane label="macOS" icon="social-apple">
        <h-button type="primary" @click="modal1 = true">显示对话框</h-button>
        <h-msg-box
          v-model="modal1"
          title="普通的Modal对话框标题"
          :closable="false"
          :mask-closable="false"
          :loading="true"
          :scrollable="true"
          :transfer="true">
          <p>对话框内容</p>
          <p>对话框内容</p>
          <p>对话框内容</p>
        </h-msg-box>
      </h-tab-pane>
      <h-tab-pane label="Windows" icon="social-windows">标签二的内容</h-tab-pane>
      <h-tab-pane label="Android" icon="social-android">标签三的内容</h-tab-Pane>
    </h-tabs>
    <h2>迷你型</h2>
    <p>设置属性 size 为 small 可以显示为迷你型，只在 type 为 line 时有效。</p>
    <h-tabs size="small" type="line">
      <h-tab-pane label="标签一">标签一的内容</h-tab-pane>
      <h-tab-pane label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs>
    <h2>卡片样式</h2>
    <p>设置属性 type 为 card 可以显示卡片样式，常用于容器顶部</p>
    <h-tabs type="card">
      <h-tab-pane label="标签一">标签一的内容</h-tab-pane>
      <h-tab-pane label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs>
    <h2>可关闭 </h2>
    <p>通过设置属性 closable 可以关闭某一项，仅在 type 为 card 时有效。<br>
    需结合 @on-tab-remove 事件手动关闭标签页。</p>
    <h-tabs type="card" ref="closetab" closable @on-tab-remove="handleTabRemove" @on-before-tab-remove="beforeTabRemove" :isRemoveTab="false">
      <h-tab-pane v-if="tab0" label="标签一">标签一的内容</h-tab-pane>
      <h-tab-pane v-if="tab1" label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane v-if="tab2" label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs>
    <h-button @on-click="closeTab">关闭tab</h-button>
    <!-- <h-tabs type="card" @on-tab-remove="handleTabRemove">
      <h-tab-pane v-if="tab0" label="标签一" closable>标签一的内容</h-tab-pane>
      <h-tab-pane v-if="tab1" label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane v-if="tab2" label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs> -->
    <h2>附加内容 </h2>
    <p>设置 slot extra 可以在页签右边添加附加操作。</p>
    <h-tabs ref="remove" type="card" closable @on-tab-remove="handleTabRemove1" showArrow>
      <h-tab-pane v-for="tab in tabs" :key="tab" :label="'标签' + tab">标签{{ tab }}的内容</h-tab-pane>  
    </h-tabs>
     <h-button type="ghost" @click="handleTabsAdd(true)" size="small" slot="extra">增加</h-button>
     <h-button type="ghost" @click="handleTabsAdd(false)" size="small" slot="extra">减少</h-button>
    <h2>不使用动画</h2>
    <p>通过设置属性 animated 为 false 可以禁用动画。</p>
    <h-tabs :animated="false" panelAbove @on-dblclick="ceshi" @on-click="ceshi1">
      <h-tab-pane label="标签一"><div>标签一的内容</div><h-button type='error'>鸟</h-button></h-tab-pane>
      <h-tab-pane label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs>
    <p>可以根据业务自定义 UI，需要一点额外的样式覆盖。</p>
    <h2>关闭确认</h2>
    <h-tabs ref="closetab" type="card" closable @on-before-tab-remove="beforeTabRemove" :isRemoveTab="false" panelAbove>
      <h-tab-pane v-if="tabs0" label="标签一" name="0">标签一的内容</h-tab-pane>
      <h-tab-pane v-if="tabs1" label="标签二" name="1">标签二的内容</h-tab-pane>
      <h-tab-pane v-if="tabs2" label="标签三" name="2">标签三的内容</h-tab-pane>
    </h-tabs>
    <h-tabs type="card" closable @on-tab-remove="handleTabRemove">
      <h-tab-pane v-if="tab0" label="标签一">标签一的内容</h-tab-pane>
      <h-tab-pane v-if="tab1" label="标签二">标签二的内容</h-tab-pane>
      <h-tab-pane v-if="tab2" label="标签三">标签三的内容</h-tab-Pane>
    </h-tabs>
  </div>
</template>
<script>
  export default {  
    data () {
      return { 
        columns1:[{
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
        },
        {
          title: '地址',
          key: 'address',
          sortType:'asc'
        }],
        data1:[],
        modal1:false,
        tab0: true,
        tab1: true,
        tab2: true,
        tabs0: true,
        tabs1: true,
        tabs2: true,
        tabs:2,
        val:'name2',
        model6:'',
        val1:[],
        baseData: [
          {
            title: 'parent',
            id: '1-0',
            expand: true,
            children: [
              {
                title: 'child1',
                id: '1-1',
                expand: true,
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2'
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],   
        curIndex:null, 
      }
    },
    methods: {
      closeTab(){
        this.$refs.closetab.handleRemove(this.curIndex,true);
      },
      beforeTabRemove(index,name){
        let that = this;
        this.curIndex = index;
        this.$hMsgBox.confirm({
          content: '<p>是否关闭此页签</p>',
          onOk: () => {
            setTimeout(()=>{
              that.$refs.closetab.handleRemove(that.curIndex,true)
              this['tabs' + name] = false;

            }, 300);
            
          },
          onCancel: () => {
            this.$hMessage.info('你点击了取消按钮')
          }
        })
      },
      ceshi(val){
        console.log('双击'+val)
      },
      ceshi1(val){
        console.log('单击'+val)
      },
      handleTabRemove (name) {
        alert(name)
        this['tab' + name] = false;
      },
      handleTabRemove1(name){
        // this.tabs--;
        console.log(this.tabs)
      },
      handleTabsAdd (status) {
        if(status){
          this.tabs ++;
        }else{
          this.tabs --;
          this.$refs.remove.handleRemove(this.tabs,true);//this.tabs 表示tab的顺序数
        }
      },
      selectChange(data){
        console.log(data);
      },
    },
    mounted () {
      // this.updateTree(this.baseData);
    }
  }
</script>
<style type="text/css">
 /* .h-tabs-nav-right{
    padding-right: 0px !important;
    border-right: 1px solid #d7dde4;
  }
  .h-tabs-nav-right i{
    display: none;
  }
  .h-tabs-content-right{
    border: none !important;
  }*/
</style>