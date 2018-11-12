<template>
  <div>
    <h1>基本用法</h1>
    <h-tooltip content="这里是提示文字">
      当鼠标经过这段文字时，会显示一个气泡框
    </h-tooltip>
    <br>
    <br>
    <h1>上下左右</h1>
    <div class="top">
      <h-tooltip content="Top Left 文字提示" placement="top-start" imdiaClose>
          <h-button>上左</h-button>
      </h-tooltip>
      <h-tooltip content="Top Center 文字提示" placement="top">
          <h-button>上边</h-button>
      </h-tooltip>
      <h-tooltip content="Top Right 文字提示" placement="top-end">
          <h-button>上右</h-button>
      </h-tooltip>
    </div>
    <div class="center">
      <div class="center-left">
          <h-tooltip content="Left Top 文字提示" placement="left-start">
              <h-button>左上</h-button>
          </h-tooltip><br><br>
          <h-tooltip content="Left Center 文字提示" placement="left">
              <h-button>左边</h-button>
          </h-tooltip><br><br>
          <h-tooltip content="Left Bottom 文字提示" placement="left-end">
              <h-button>左下</h-button>
          </h-tooltip>
      </div>
      <div class="center-right">
          <h-tooltip content="Right Top 文字提示" placement="right-start">
              <h-button>右上</h-button>
          </h-tooltip><br><br>
          <h-tooltip content="Right Center 文字提示" placement="right">
              <h-button>右边</h-button>
          </h-tooltip><br><br>
          <h-tooltip content="Right Bottom 文字提示" placement="right-end">
              <h-button>右下</h-button>
          </h-tooltip>
      </div>
    </div>
    <div class="bottom">
      <h-tooltip content="Bottom Left 文字提示" placement="bottom-start">
          <h-button>下左</h-button>
      </h-tooltip>
      <h-tooltip content="Bottom Center 文字提示" placement="bottom">
          <h-button>下边</h-button>
      </h-tooltip>
      <h-tooltip content="Bottom Right 文字提示" placement="bottom-end">
          <h-button>下右</h-button>
      </h-tooltip>
    </div>
    <br>
    <br>
    <h1>多行</h1>
    <h-tooltip placement="top">
        <h-button>多行</h-button>
        <div slot="content">
            <p>显示多行信息</p>
            <p><i>可以自定义样式</i></p>
        </div>
    </h-tooltip>
    <h1>点击关闭</h1>
    <h-tooltip placement="top" content="可以禁用文字提示" :disabled="disabled">
        <h-button @click="disabled = true">点击关闭提示</h-button>
    </h-tooltip>
    <br><br>
    <h1>延时</h1>
    <h-tooltip placement="top" content="Tooltip 文字提示" :delay="1000">
        <h-button @click="disabled = true">延时1秒显示</h-button>
    </h-tooltip>
    <h1>always</h1>
    <h-tooltip placement="top" content="Tooltip 文字提示总是可见" :disabled="disabled" always>
        <h-button @click="disabled = true">提示总是显示</h-button>
    </h-tooltip>
    <h-tooltip content="这里是提示文字" placement="bottom" always>
        当鼠标经过这段文字时，会显示一个气泡框
    </h-tooltip>
    <h1>disable</h1>
    <h-tooltip placement="top" content="可以禁用文字提示" :disabled="disabled" @on-popper-hide="tipHide">
        <h-button @click="disabled = true">点击关闭提示</h-button>
    </h-tooltip>
    <h-tooltip content="这里是提示文字" placement="top" :disabled="true" @on-popper-hide="tipHide">
        <h-button>不显示提示信息框</h-button>
    </h-tooltip>
  </div>
</template>

<script>

export default {
  name: 'tooltips',
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    tipHide () {
      console.log("提示消息消失事件")
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

</style>