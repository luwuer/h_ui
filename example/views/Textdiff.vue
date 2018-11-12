<template>
  <div>
    <h-row>
      <h-col span="12">
        <div @click="handleClick('inputLeft')">
          <input
            style="display: none;"
            ref="inputLeft"
            type="file" 
            @change="handleChange($event, 'left')">
           <h-button type="primary">选择左边文件</h-button> 
        </div>
      </h-col>
      <h-col span="12">
        <div @click="handleClick('inputRight')">
          <input
            style="display: none;"
            ref="inputRight"
            type="file" 
            @change="handleChange($event, 'right')">
           <h-button type="primary">选择右边文件</h-button> 
        </div>
      </h-col>
    </h-row>
    <h-textdiff :leftValue="leftValue" :rightValue="rightValue" leftTitle="左边内容" rightTitle="右边内容" ref="textdiff" @on-left-select="rowSelect" @on-right-select="rowSelect"></h-textdiff>
    <h-button type="primary" @click="diffText" >手动触发比较文本</h-button>
    <h-textdiff :leftValue="leftValueself" :rightValue="rightValueself" leftTitle="左边内容" rightTitle="右边内容" ref="textdiffself" @on-left-select="rowSelect" @on-right-select="rowSelect" isShowRow diffBgColor="#ccc" height="100"></h-textdiff>
    <br>
    <h-row>
      <h-col span="12">
        <div @click="handleClick('inputLeft')">
          <input
            style="display: none;"
            ref="inputLeft"
            type="file" 
            @change="handleChange($event, 'left')">
           <h-button type="primary">选择左边文件</h-button> 
        </div>
      </h-col>
      <h-col span="12">
        <div @click="handleClick('inputRight')">
          <input
            style="display: none;"
            ref="inputRight"
            type="file" 
            @change="handleChange($event, 'right')">
           <h-button type="primary">选择右边文件</h-button> 
        </div>
      </h-col>
    </h-row>
    <h-textdiff :leftValue="leftValue" :rightValue="rightValue" leftTitle="左边内容" rightTitle="右边内容" ref="textdiff" @on-left-select="rowSelect" @on-right-select="rowSelect" isLeftEdit isRightEdit :isShowTitle="false" :isShowSelect="false" height="100"></h-textdiff>
  </div>
</template>
<script >
  export default {
    data () {
      return {
        leftValue: '',
        rightValue: '',
        leftValueself: '',
        rightValueself: '',
      }
    },
    methods: {
      rowSelect (s) {
        alert(s)
      },
      changeLeft (val) {
        this.leftValue = val
      },
      diffText () {
        this.$refs.textdiffself.diff({left: '你好，我是左侧内容', right: 'nihao,我是右侧'})
        // this.leftValueself = ''
        // this.rightValueself = ''
      },
      handleClick (input) {
        this.$refs[input].click()
      },
      handleChange ($event, valKey) {
        let that = this
        let e = $event
        // e.stopPropagation();
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        if (e.target.files && e.target.files.length > 0) {
          let reader = new FileReader()
          reader.readAsText(e.target.files[0], "utf-8");
          reader.onload = function (e) {
            if (valKey == 'left') {
              that.leftValue = e.target.result
              that.leftValueself = e.target.result
            } else {
              that.rightValue = e.target.result
              that.rightValueself = e.target.result
            }
          }
        } 
        // else {
        //   this.$hMessage.info('请选择一个文件')
        // }
        valKey == 'left' ? this.$refs.inputLeft.value = null : this.$refs.inputRight.value = null;
      },
    }
  }
</script>
