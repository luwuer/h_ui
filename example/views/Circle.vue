<template>
	<div>
	  <h2>基本用法</h2>
		<h-circle :percent="80">
      <span class="demo-Circle-inner" style="font-size:24px">80%</span>
    </h-circle>
    <h-circle :percent="100" stroke-color="#1ABE6B">
      <h-icon name="right" size="60" style="color:#1ABE6B"></h-icon>
    </h-circle>
    <h-circle :percent="35" stroke-color="#ff5500">
      <span class="demo-Circle-inner">
        <h-icon name="alert" size="50" style="color:#ff5500"></h-icon>
      </span>
    </h-circle>
    <h2>配合外部组件使用</h2>
    <h-circle :percent="percent" :stroke-color="color">
      <h-icon v-if="percent == 100" name="right" size="60" style="color:#5cb85c"></h-icon>
      <span v-else style="font-size:24px">{{ percent }}%</span>
    </h-circle>
    <h-button-group size="large">
      <h-button icon="zuojiantou" @click="add"></h-button>
      <h-button icon="youjiantou" @click="minus"></h-button>
    </h-button-group>
    <h2>自定义更多样式</h2>
    <h-circle
      :size="250"
      :trail-width="4"
      :stroke-width="5"
      :percent="75"
      stroke-linecap="square"
      stroke-color="#43a3fb">
      <div class="demo-Circle-custom">
        <h1>42,001,776</h1>
        <p>消费人群规模</p>
        <span>
          总占人数
          <i>75%</i>
        </span>
      </div>
    </h-circle>
	</div>
</template>
<script>
export default{
	data () {
    return {
      percent: 0
    }
  },
  computed: {
    color () {
      let color = '#2db7f5';
      if (this.percent == 100) {
        color = '#5cb85c';
      }
      return color;
    }
  },
  methods: {
    add () {
      if (this.percent >= 100) {
        return false;
      }
      this.percent += 10;
    },
    minus () {
      if (this.percent <= 0) {
        return false;
      }
      this.percent -= 10;
    }
  }
}
</script>
<style type="text/css" scoped>
.demo-Circle-custom h1{
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
}
.demo-Circle-custom p{
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
}
.demo-Circle-custom span{
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before{
      content: '';
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    };
}
.demo-Circle-custom span i{
    font-style: normal;
    color: #3f414d;
}

</style>