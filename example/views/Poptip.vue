<template>
  <div>
    <h1>气泡提示组件基本用法</h1>
    <h2>基本用法</h2>
    <h-poptip trigger="hover" title="提示标题" content="提示内容" closeOutClick>
      <h-button>hover 激活</h-button>
    </h-poptip>
    <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡气泡">
      <h-button>click 激活</h-button>
    </h-poptip>
    <h-poptip trigger="focus" title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡气泡">
      <h-button>focus 激活</h-button>
    </h-poptip>
    <h-poptip trigger="focus" title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡">
      <h-input placeholder="输入框的 focus"></h-input>
    </h-poptip>
    <h2>位置</h2>
    <div class="top">
      <h-poptip title="提示标题" content="提示内容" placement="top-start" closeOutClick>
        <h-button>上左</h-button>
      </h-poptip>
      <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="top">
        <h-button>上边</h-button>
      </h-poptip>
      <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="top-end">
        <h-button>上右</h-button>
      </h-poptip>
    </div>
    <div class="center">
      <div class="center-left">
        <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="left-start">
            <h-button>左上</h-button>
        </h-poptip><br><br>
        <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="left">
            <h-button>左边</h-button>
        </h-poptip><br><br>
        <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="left-end">
            <h-button>左下</h-button>
        </h-poptip>
      </div>
      <div class="center-right">
        <h-poptip trigger="hover" title="悬浮/点击出现的消息" placement="right-start" width="100">
          <h-button>右上</h-button>
          <div class="smenu" slot="content">
            <ul>
              <li>一级菜单</li>
              <li>二级菜单</li>
              <li>三级菜单</li>
              <li>四级菜单</li>
            </ul>
          </div>
        </h-poptip><br><br>
        <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="right">
          <h-button>右边</h-button>
        </h-poptip><br><br>
        <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="right-end">
          <h-button>右下</h-button>
        </h-poptip>
      </div>
    </div>
    <div class="bottom">
      <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="bottom-start">
        <h-button>下左</h-button>
      </h-poptip>
      <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="bottom">
        <h-button>下边</h-button>
      </h-poptip>
      <h-poptip title="悬浮/点击出现的消息" content="悬浮出现的消息气泡气泡气泡" placement="bottom-end">
        <h-button>下右</h-button>
      </h-poptip>
    </div>
    <h2>通过v-model来控制提示框的显示和隐藏</h2>
    <h-poptip v-model="visible">
      <a>click 激活</a>
      <div slot="title"><i>自定义标题</i></div>
      <div slot="content">
          <a @click="close">关闭提示框</a>
      </div>
    </h-poptip>
    <h2>通过自定义 slot 来实现复杂的内容。</h2>
    <h-poptip placement="right" width="400">
      <h-button type="ghost">click 激活</h-button>
      <div class="api" slot="content">
        <table>
          <thead>
            <tr>
              <th>版本号</th>
              <th>更新时间</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0.9.5</td>
              <td>2016-10-26</td>
              <td>新增信息提示组件 <code>Tooltip</code>和<code>Poptip</code></td>
            </tr>
            <tr>
              <td>0.9.4</td>
              <td>2016-10-25</td>
              <td>新增对话框组件 <code>Modal</code></td>
            </tr>
            <tr>
              <td>0.9.2</td>
              <td>2016-09-28</td>
              <td>新增选择器组件 <code>Select</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </h-poptip>
    <h2>通过设置属性confirm开启确认框模式。确认框只会以 click 的形式激活，并且只会显示 title 的内容，忽略 content</h2>
    <h-poptip
        confirm
        title="Are you sure delete this task?"
        @on-ok="ok"
        @on-cancel="cancel"
        ok-text="yes"
        cancel-text="no">
        <h-button>国际化</h-button>
    </h-poptip>
    <h-poptip
        confirm
        title="您确认删除这条内容吗？"
        @on-ok="ok"
        @on-cancel="cancel"
        @on-popper-hide="vChange">
        <h-button>删除</h-button>
    </h-poptip>
  </div>
</template>

<script>

export default {
  name: 'tooltips',
  data() {
    return {
      visible: false
    }
  },
  methods:{
    close(){
      this.visible = false
    },
    ok () {
      this.$hMessage.info('点击了确定');
    },
    cancel () {
      this.$hMessage.info('点击了取消');
    },
    vChange(){
      console.log("提示框消失了");
    }
  } 
}
</script>
<style type="text/css" scoped>
	.top,.bottom{
    text-align: center;
  }
  .center{
    width: 300px;
    margin: 10px auto;
    overflow: hidden;
  }
  .center-left{
    float: left;
  }
  .center-right{
     float: right;
  }
  a:hover{
    color: blue;
  }
  ul>li{
    line-height: 30px;
/*    background-color: #464c5b;*/
    color: #000;
  }
  ul>li:hover{
    cursor: pointer;
    color: #464c5b;
  }

</style>