<template>
  <div>

   <h-file-import @on-choose-file="getFile">
      <h-button type="ghost" icon="activity">导入文件</h-button>
    </h-file-import>
    <h-file-import @on-choose-file="getFile" excelSize="all">
      <h-button type="ghost" icon="activity" >导入文件All</h-button>
    </h-file-import>
    <h-file-import @on-choose-file="getFile" excelIdx="2">
      <h-button type="ghost" icon="activity" >导入第二张表格</h-button>
    </h-file-import>
    <h-file-import @on-choose-file="getFile" excelIdx="3">
      <h-button type="ghost" icon="activity" >导入第三张表格</h-button>
    </h-file-import>
    <h-table :data="data" :columns="columns" v-show="data.length > 0"></h-table>
    <h-file-import @on-choose-file="getFile" type="drag">
       <div style="padding: 20px 0">
          <h-icon type="ios-cloud-upload" size="52" style="color: #3399ff"></h-icon>
          <p>点击或将文件拖拽到这里上传</p>
        </div>
    </h-file-import>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        columns: [],
        data: []
      }
    },
    methods: {
      getFile (data, columnsTitle) {
        let columns = []
        if (data && data.length > 0 && columnsTitle[0].length > 0) {
          for (let item of columnsTitle[0]) {
            let columnsItem = {}
            columnsItem.title = item
            columnsItem.key = item
            columns.push(columnsItem)
          }
          this.columns = columns
          this.data = data[0]
        } else {
          this.$hMessage.info('导入表格无数据')
        }
      }
    }
  }
</script>