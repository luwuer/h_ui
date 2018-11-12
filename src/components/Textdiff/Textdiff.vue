<template>  
  <div class="h-textdiff h-row">
    <div class='h-textdiff-wrapper h-col-span-12'>
      <div class='h-textdiff-title no-border-right' v-if="isShowTitle">{{leftTitle}}</div>
      <div class="h-textdiff-content no-border-right" :style="{height: height + 'px'}">  
        <pre @scroll.native="scrollLeft" ref="leftArea" class="h-textdiff-leftContent" ><code v-for="(item, index) in leftListRebuild" :key="index" @click.stop.prevent="rowClick($event, index)" v-html="item.value || item" :style="{minWidth: leftMinWidth + 'px', background: item.isDiff && diffBgColor ? diffBgColor : ''}"></code></pre>  
        <textarea v-model='leftTextValue'  ref="left" :autofocus="leftautofocus"></textarea>
      </div> 
    </div>  
    <div class='h-textdiff-wrapper h-col-span-12'>
      <div class='h-textdiff-title' v-if="isShowTitle">{{rightTitle}}</div>
      <div class="h-textdiff-content" :style="{height: height + 'px'}">  
        <pre @scroll.native="scrollRight" ref="rightArea" class="h-textdiff-rightContent" ><code v-for="(item, index) in rightListRebuild" :key="index" @click.stop.prevent="rowClick($event, index)" v-html="item.value || item" :style="{minWidth: rightMinWidth + 'px', background: item.isDiff && diffBgColor ? diffBgColor : ''}"></code></pre>  
        <textarea v-model='rightTextValue' ref="right" right="rightautofocus"></textarea>  
      </div>  
    </div>
    <div class="h-textdiff-selectContent h-col h-col-span-24" v-if="isShowSelect" :title="leftSelectRowContent" placeholder="leftCurrentSelect">{{leftSelectRowContent}}</div>
    <div class="h-textdiff-selectContent h-col h-col-span-24" v-if="isShowSelect" :title="rightSelectRowContent" placeholder="rightCurrentSelect">{{rightSelectRowContent}}</div>
  </div>
</template>  
  
<script>   
  export default {   
  name: "Textdiff", 
  data(){  
    return{  
      leftTextValue: this.leftValue || '', // 左侧文本域文本
      rightTextValue: this.rightValue || '', // 右侧文本域文本
      leftautofocus: false,
      rightautofocus: false,
      leftListRebuild: [],
      rightListRebuild: [],
      leftSelectRowContent: '',
      rightSelectRowContent: '',
      leftMinWidth: '',
      rightMinWidth: ''
    }  
  }, 
  props: {
    leftValue: String,
    rightValue: String,
    leftTitle: String,
    rightTitle: String,
    diffColor: {
      type: String,
      default: 'red'
    },
    moreColor: {
      type: String,
      default: 'blue'
    },
    isShowTitle: {
      // 是否显示title(无论是否设置title)
      type: Boolean,
      default: true
    },
    isShowSelect: {
      // 是否显示currentSelect
      type: Boolean,
      default: true
    },
    diffBgColor: String,
    height: [String, Number]
  },
  watch:{  
    leftValue (val) { // 外部传入左侧值
      this.leftTextValue = this.leftValue
    },
    rightValue (val) { // 外部传入右侧值
      this.rightTextValue = this.rightValue
    },
    //监听输入文字的变化 leftTextValue左边文本域的数据 rightTextValue右边文本域数据 监听之后实时赋值 显示文本的不同之处 
    leftTextValue(val){
      let selectedRow = this.$refs.leftArea.getElementsByClassName('h-textdiff-rowSelect')
      if (selectedRow.length > 0) {
        for (let i = 0; i < selectedRow.length; i++) {
          selectedRow[i].className = ''
        }
      }
      this.leftSelectRowContent = ''
      this.leftList = []
      this.righList = []
      this.diff({  
        left: val,  
        right:this.rightTextValue  
      });
      this.leftautofocus = true
      this.rightautofocus = false
    },  
    rightTextValue(val){  
      let selectedRow = this.$refs.rightArea.getElementsByClassName('h-textdiff-rowSelect')
      if (selectedRow.length > 0) {
        for (let i = 0; i < selectedRow.length; i++) {
          selectedRow[i].className = ''
        }
      }
      this.rightSelectRowContent = ''
      this.leftList = []
      this.righList = []
      this.diff({  
        left: this.leftTextValue,  
        right: val  
      }); 
      this.leftautofocus = false
      this.rightautofocus = true
    }  
  },
  mounted() {
    this.$refs.leftArea.addEventListener('scroll', () => {
      this.scrollLeft()
    })
    this.$refs.rightArea.addEventListener('scroll', () => {
      this.scrollRight()
    })
  },
  created(){   //初始化对比  
    this.diff({  
      left: this.leftTextValue,  
      right: this.rightTextValue  
    });  
  },  
  methods:{
    // 同步滚动   
    scrollLeft(){ 
      if (this.$refs.rightArea.scrollHeight - this.$refs.rightArea.scrollTop > 0 ) {
        this.$refs.rightArea.scrollTop = this.$refs.leftArea.scrollTop; 
      }
      if (this.$refs.rightArea.scrollWidth - this.$refs.rightArea.scrollLeft > 0 ) {
        this.$refs.rightArea.scrollLeft = this.$refs.leftArea.scrollLeft; 
      }
    },
    scrollRight() {  
       if (this.$refs.leftArea.scrollHeight - this.$refs.leftArea.scrollTop > 0 ) {
        this.$refs.leftArea.scrollTop = this.$refs.rightArea.scrollTop; 
      }
      if (this.$refs.leftArea.scrollWidth - this.$refs.leftArea.scrollLeft > 0 ) {
        this.$refs.leftArea.scrollLeft = this.$refs.rightArea.scrollLeft; 
      }
    }, 
    rowClick(e, index) {
      // 可优化，记住上次点击位置
      // 左右看做一行，同时被点击
      // let selectedRow = e.currentTarget.parentElement.getElementsByClassName('h-textdiff-rowSelect')
      let selectedRow = document.getElementsByClassName('h-textdiff-rowSelect')
      // if (selectedRow.length > 0) {
      //   for (let i = 0; i < selectedRow.length; i++) {
      //     selectedRow[i].className = ''
      //   }
      // }
      // 当 class为''时，会自动从selectRow中移除
      while (selectedRow.length > 0) {
        selectedRow[0].className = ''
      }
      e.currentTarget.className = 'h-textdiff-rowSelect'
      if(e.currentTarget.parentElement.className == 'h-textdiff-leftContent') {
        this.leftSelectRowContent = e.currentTarget.innerText.trim()
        // 右侧对应行不存在
        if (this.$refs.rightArea.children[index]) {
          this.$refs.rightArea.children[index].className = 'h-textdiff-rowSelect'
          this.rightSelectRowContent = this.$refs.rightArea.children[index].innerText.trim()
        } else {
          this.rightSelectRowContent = ''
        }
        this.$emit('on-left-select', this.leftSelectRowContent)
      } else {
        this.rightSelectRowContent = e.currentTarget.innerText.trim()
        // 左侧对应行不存在
        if (this.$refs.leftArea.children[index]) {
          this.$refs.leftArea.children[index].className = 'h-textdiff-rowSelect'
          this.leftSelectRowContent = this.$refs.leftArea.children[index].innerText.trim()
        } else {
          this.leftSelectRowContent = ''
        }
        this.$emit('on-right-select', this.rightSelectRowContent)       
      }
    },
    diff (op) {  
      if (!op) {  
        return  
      }  
      this.leftTextValue = op.left
      this.rightTextValue = op.right
      if (!op.left || !op.right) {  
        this.leftListRebuild = (op.left != '') ? op.left.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").split('\n') : []
        this.rightListRebuild = (op.right != '') ? op.right.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").split('\n') : []
        this.$nextTick(() => {
          this.leftMinWidth = this.$refs.leftArea.scrollWidth ? this.$refs.leftArea.scrollWidth : this.$refs.leftArea.clientWidth
          this.rightMinWidth = this.$refs.rightArea.scrollWidth ? this.$refs.rightArea.scrollWidth : this.$refs.rightArea.clientWidth
        })
        return 
      }
      let leftListInit =  op.left.split('\n') //左侧初始化数据数组
      let rightListInit =  op.right.split('\n') //右侧初始化数据数组
      let maxList = leftListInit
      let minList = rightListInit
      let max_new_value = ''
      let min_new_value = '' 
      let maxListValue = [] // 保存行数较多数据，最后整体赋值给this.leftList
      let minListValue = []
      let valueDiffStyle = "color:" + this.diffColor // 不同数据样式
      let valueMoreStyle = "color:" + this.moreColor // 多余数据样式
      if (leftListInit.length > 0 && rightListInit.length > 0) {
        maxList = leftListInit.length >= rightListInit.length ? leftListInit : rightListInit
        minList = leftListInit.length < rightListInit.length ? leftListInit : rightListInit
        // 对行数较多文本进行循环
        for (let i = 0; i < maxList.length; i++) {
          let isDiff = false // 是否不同的标识，有不同的行需要加背景色
          if (i <= minList.length - 1) {
            // 左右行对比
            let maxLength = maxList[i].length > minList[i].length ? maxList[i].length : minList[i].length
            let diff_start = 0  // 记住diff起始位置
            let diff_end = 0  // 记住diff结束位置
            let maxdiffText = '' // 记住左右不同的数据
            let mindiffText = ''
            for(let j = 0; j< maxLength; j++) {
              if (maxList[i][j] && minList[i][j] && maxList[i][j] === minList[i][j]) {
                // 左右相等时进行处理
                if (diff_start == diff_end && maxdiffText ==='' && mindiffText === '') {
                  // diff起始位置==结束位置,继续比较
                  max_new_value += String(maxList[i][j]).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")
                  min_new_value += String(maxList[i][j]).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")
                  diff_start = j
                  diff_end = j
                } else {
                  // diff起始位置!==结束位置,左右不等结束,将diff数据用span包裹，并初始化标识
                  if (maxdiffText != '' && mindiffText != '') {
                    max_new_value += "<span style='" + valueDiffStyle + "'>" + maxdiffText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")  + "</span>"
                    min_new_value += "<span style='" + valueDiffStyle + "'>" + mindiffText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")   + "</span>" 
                    diff_start = j
                    diff_end = j
                    maxdiffText = ''
                    mindiffText = ''
                    max_new_value += maxList[i][j].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")
                    min_new_value += maxList[i][j].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")
                  }
                }
              } else {
                // 左右比较不相等时，更新diff_end、maxdiffText、mindiffText
                isDiff = true
                maxdiffText += maxList[i][j] || maxList[i][j] === '' ? maxList[i][j] : ''
                mindiffText += minList[i][j] || minList[i][j] === '' ? minList[i][j] : ''
                diff_end += 1
              }
            }
            // 循环结束，处理还存在不相等情况
            if (diff_start != diff_end || maxdiffText != '' || mindiffText != '') {
              max_new_value += "<span style='" + valueDiffStyle + "'>" +  maxdiffText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")   + "</span>"
              min_new_value += "<span style='" + valueDiffStyle + "'>" +  mindiffText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")  + "</span>" 
              
            }
            // 将每行最终结果保存至maxListValue
            // maxListValue.push(max_new_value)
            maxListValue.push({
              value: max_new_value,
              isDiff: isDiff
            })
            max_new_value = ''
            // minListValue.push(min_new_value)
            minListValue.push({
              value: min_new_value,
              isDiff: isDiff
            })
            min_new_value = ''
          } else {
            // 多余的行蓝色显示
            isDiff = true
            max_new_value += "<span style='" + valueMoreStyle + "'>" + maxList[i].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;")   + "</span>"
            // maxListValue.push(max_new_value)
            maxListValue.push({
              value: max_new_value,
              isDiff: isDiff
            })
            max_new_value = ''
          }
        }
      }
      // leftListInit
      this.leftListRebuild = leftListInit.length == maxList.length ? maxListValue : minListValue 
      this.rightListRebuild = rightListInit.length == minList.length ? minListValue : maxListValue
      this.$nextTick(() => {
        this.leftMinWidth = this.$refs.leftArea.scrollWidth
        this.rightMinWidth = this.$refs.rightArea.scrollWidth
      })
    }  
  }
}
</script>