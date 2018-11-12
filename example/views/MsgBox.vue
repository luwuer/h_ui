<template>
	<div>	
    <h1>普通组件使用</h1>
    <h-button type="primary" @click="modal1 = true">显示对话框</h-button>
    <h-msg-box
      v-model="modal1"
      title="普通的Modal对话框标题"
      @on-ok="ok"
      @on-cancel="cancel"
      :closable="false"
      :mask-closable="false"
      :loading="true"
      :scrollable="false"
      @on-visible-change="vChange"
      :escClose="false"
      top="0"
      isOriginal
      class-name="vertical-center-modal"
      >
      <p>对话框内容</p>
      <p>对话框内容</p>
      <p>对话框内容</p>
    </h-msg-box>
    <h-button @click="modal2 = true">自定义页头和页脚</h-button>
    <h-msg-box v-model="modal2" width="360" scrollable isBeyond isOriginal>
      <p slot="header" style="color:#f60;text-align:center">
        <h-icon name="prompt"></h-icon>
        <span>删除确认</span>
      </p>
      <span slot="close">删除</span>
      <div style="text-align:center">
        <p>此任务删除后，下游 10 个任务将无法执行。</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <h-button type="error" size="large" long :loading="modal_loading" @click="del">删除</h-button>
      </div>
    </h-msg-box>
    <h-button @click="modal3 = true">不带标题栏</h-button>
    <h-msg-box v-model="modal3" @on-close="onClose">
        <p>对话框内容</p>
        <p>对话框内容</p>
        <p>对话框内容</p>
    </h-msg-box>
    <h-button @click="modal4 = true">国际化</h-button>
    <h-msg-box
        v-model="modal4"
        title="Modal Title"
        ok-text="OK"
        :zIndex="10001"
        :maximize = true
        cancel-text="Cancel">
        <p>Something...</p>
        <p>Something...</p>
        <p>Something...</p>
    </h-msg-box>
    <h-button @click="modal5 = true">设置宽度</h-button>
    <h-msg-box
        v-model="modal5"
        title="自定义宽度"
        width="300">
        <p>自定义宽度，单位 px，默认 520px。</p>
        <p>对话框的宽度是响应式的，当屏幕尺寸小于 768px 时，宽度会变为自动<code>auto</code>。</p>
    </h-msg-box>
    <h1>实例化使用方法</h1>	
    <h2>基本用法</h2>
		<h-button @click="instance('info')">消息</h-button>
    <h-button @click="instance('success')">成功</h-button>
    <h-button @click="instance('warning')">警告</h-button>
    <h-button @click="instance('error')">错误</h-button>
    <h2>确认对话框</h2>
    <h-button @click="confirm">标准</h-button>
    <h-button @click="custom">自定义按钮文字</h-button>
    <h-button @click="async">异步关闭</h-button>
    <h2>自定义内容/有问题</h2>
    <h-button @click="render">自定义内容</h-button>{{value}}
    <h2>MsgBox</h2>
    <h-msg-box v-model="showModal2" title="弹窗" width="800" isBeyond>
      <div style="height: 200px;" class="tabWarp">
        <h-select v-model="mulmodel" :transfer="true" style="width:400px;" multiple ref="select">
          <h-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</h-option>
        </h-select>
        <h-tabs style="height: 200px;overflow:auto">
          <h-tab-pane label="演示">
          <Button @click="showSec">显示第二个弹框</Button>
         <!--  <h-table border :columns="columns6" :data="data5" no-filtered-data-text="筛选后结果为空123"></h-table> -->
            <h-select :transfer="true" style="width:400px;">
                <h-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
            <h-select-tree :transfer="true" v-model="val3" style="width:200px" showCheckbox :data="baseData4" filterable></h-select-tree>
          </h-tab-pane>
          <h-tab-pane label="演示1">
      <!--     <h-table border :columns="columns6" :data="data5" no-filtered-data-text="筛选后结果为空123"></h-table> -->
            <h-select :transfer="true" style="width:400px;">
                <h-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
            <h-select :transfer="true" style="width:400px;">
                <h-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
            <h-select :transfer="true" style="width:400px;">
                <h-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-tab-pane>
        </h-tabs>
      </div>
    </h-msg-box>
    <h-button @click="showModal2 = true">Modal无Tabs</h-button>
	</div>
</template>
<script>	
	export default{
		name:"MsgBoxs",
		data(){
			return {
        modal1: false,
        modal2: false,
        modal_loading: false,
        modal3: false,
        val3:[],
        modal4: false,
        modal5: false,
        mulmodel:[],
        value: '',
        showModal2: false,
        options: [
            {
                value: 'beijing',
                label: '北京市'
            },
            {
                value: 'shanghai',
                label: '上海市'
            },
            {
                value: 'shenzhen',
                label: '深圳市'
            },
            {
                value: 'hangzhou',
                label: '杭州市'
            },
            {
                value: 'nanjing',
                label: '南京市'
            },
            {
                value: 'chongqing',
                label: '重庆市'
            }
        ],
        baseData4: [
          {
            title: 'parent',
            id: '1-0',
            children: [
              {
                title: 'child1',
                id: '1-1',
        
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1',
                    children: [
                      {
                        title: 'child1-1-1-1',
                        id: '1-1-1-1'
                      }]
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2',
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: [
                  {
                    title: 'child1-2-1',
                    id: '1-2-1',
                    children: [
                      {
                        title: 'child1-2-1-1',
                        id: '1-2-1-1'
                      }]
                  },
                  {
                    title: 'child1-2-2',
                    id: '1-2-2',
                  }
                ]
              },
              {
                title: 'child3',
                id: '1-3',
                children: [
                  {
                    title: 'child1-3-1',
                    id: '1-3-1',
                    children: [
                      {
                        title: 'child1-3-1-1',
                        id: '1-3-1-1'
                      }]
                  },
                  {
                    title: 'child1-3-2',
                    id: '1-3-2',
                  }
                ]
              },
              {
                title: 'child4',
                id: '1-4',
                children: []
              },
              {
                title: 'child5',
                id: '1-5',
                children: []
              }
            ]
          }
        ],
        columns6: [
          {
            title: '日期',
            key: 'date'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age',
            filters: [
              {
                label: '大于50岁',
                value: 1
              },
              {
                label: '小于50岁',
                value: 2
              }
            ],
            // filteredValue:['18','25'],
            filterMultiple: false,
            filterRemote(_this,arg1){
              this.data5.push({
                name: '王小明1',
                age: 20,
                address: '北京市朝阳区芍药居',
                date: '2016-10-03'
              },);
            },
            filterMethod (value, row) {
              if (value === 1) {
                return row.age > 50;
              } else if (value === 2) {
                return row.age < 50;
              }
            }
          },
          {
            title: '地址',
            key: 'address',
            filters: [
              {
                label: '北京',
                value: '北京'
              },
              {
                label: '上海',
                value: '上海'
              },
              {
                label: '深圳',
                value: '深圳'
              }
            ],
            filterMethod (value, row) {
              return row.address.indexOf(value) > -1;
            }
          }
        ],
        data5: [
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居',
            date: '2016-10-03'
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗',
            date: '2016-10-01'
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道',
            date: '2016-10-02'
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道',
            date: '2016-10-04'
          }
        ],
      }
		},
		methods: {
      onClose(){
        console.log('你点击了关闭按钮');
      },
      showSec(){
        this.modal4=true;
      },
      vChange(s){
        console.log(s);
      },
      ok () {
        this.$hNotice.info({title: '点击了确定'});
      },
      cancel () {
        this.$hNotice.info({title: '点击了取消'});
      },
      del () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.modal2 = false;
          this.$hNotice.success({title: '删除成功'});
        }, 2000);
      },
      instance (type) {
        const title = '对话框的标题';
        const content = '<p>一些对话框内容</p><p>一些对话框内容</p>';
        switch (type) {
          case 'info':
            this.$hMsgBox.info({
                title: title,
                content: content,
                width:800,
                scrollable:true,
                okText:'确定1',
                zIndex:1100
                // loading:true
            });
            break;
          case 'success':
            this.$hMsgBox.success({
                width:600,
                title: title,
                content: content,
                zIndex:1200
            });
            break;
          case 'warning':
            this.$hMsgBox.warning({
                title: title,
                content: content,
                zIndex:1300
            });
            break;
          case 'error':
            this.$hMsgBox.error({
                title: title,
                content: content,
                zIndex:1400
            });
            break;
        }
      },
      confirm () {
        this.$hMsgBox.confirm({
          title: '确认对话框标题',
          content: '<p>一些对话框内容</p><p>一些对话框内容</p>',
          onOk: () => {
            console.log('点击了确定');
          },
          onCancel: () => {
            console.log('点击了取消');
          }
        });
      },
      custom () {
        this.$hMsgBox.confirm({
          title: '确认对话框标题',
          content: '<p>一些对话框内容</p><p>一些对话框内容</p>',
          okText: 'OK',
          cancelText: 'Cancel'
        });
      },
      async () {
        this.$hMsgBox.confirm({
          title: '确认对话框标题',
          content: '<p>对话框将在 2秒 后关闭</p>',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.$hMsgBox.remove();
              this.$hNotice.info({title: '异步关闭了对话框'});
            }, 2000);
          }
        });
      },
      render () {
        var _this = this;
        this.$hMsgBox.confirm({
          render: (h) => {
            return h('h-input', {
              props: {
                value: _this.value,
                autofocus: true,
                placeholder: 'Please enter your name...'
              },
              on: {
                input: (val) => {
                  _this.value = val;
                  if (val=='4') {
                    _this.destroy();
                  }
                }
              }
            })
          }
        })
      },
      destroy () {
        this.$hMsgBox.remove();
      }
		},
    watch:{
      showModal2(val){
        if (val) {
          // this.$refs.select.focus();
          this.options=[{
                value: 'beijing',
                label: '北京市'
            }]
        }
      }
    }
	}
</script>
<style>
	.tabWarp{
    overflow:auto;
  }
  .vertical-center-modal{
    display: flex;
    align-items: center;
    /*justify-content: center;*/

  }
</style>