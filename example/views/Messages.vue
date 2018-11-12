<template>
	<div>
	  <h1>message组件</h1>
	  <h2>基本用法</h2>
		<h-button type="primary" @click="info">显示普通提醒</h-button>
		<h-button @click="success">显示成功提示</h-button>
    <h-button @click="warning">显示警告提示</h-button>
    <h-button @click="error">显示错误提示</h-button>
    <h2>自定义消失时间</h2>
    <h-button @click="time">显示一个10秒的提示</h-button>
    <h2>可关闭按钮</h2>
    <h-button @click="closable">显示一个可关闭的按钮</h-button>
    <h-button @click="loading">加载中。。。。</h-button>
    <h-button @click="destroy">全局销毁</h-button>
    <h-button type="primary" @click="globalConfig">设置全局变量</h-button>
	</div>
</template>
<script>
export default {
  methods: {
    info () {
      this.$hMessage.info('这是一条普通消息，会主动消失');
    },
    success () {
      this.$hMessage.success('这是一条成功消息，会主动消失');
    },
    warning () {
      this.$hMessage.warning('这是一条警告消息，会主动消失');
    },
    error () {
      this.$hMessage.error('这是一条异常消息，会主动消失');
    },
    time () {
      this.$hMessage.info({
        content: '我将在10秒后消失',
        duration: 100
      });
    },
    closable () {
      this.$hMessage.info({
        content: '可手动关闭的提示',
        duration: 0,
        closable: true,
        onClose:this.closeFn
      });
    },
    loading(){
      this.$hMessage.loading({
        content: '正在加载中...',
        duration: 0
      });
    },
    destroy(){
      this.$hMessage.destroy();
    },
    closeFn () {
      console.log("触发了关闭事件")
    },
    globalConfig(){
      this.$hMessage.config({
        top: 200,
        duration: 5
      })
    }
  },
  mounted () {
    this.$hMessage.config({
        top: 200,
        duration: 3
    });
  }
}
</script>