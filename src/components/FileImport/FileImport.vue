<template>
  <div :class="wrapCls">
    <div
      :class="classes"
      @click="handleClick"
      @drop.prevent="onDrop"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false">
      <input
        ref="input"
        type="file"
        :class="[prefixCls + '-input']"
        @change="handleChange"
        :accept="accept">
      <!-- 手动配置 -->
      <slot v-if="selfConfig" name="chooseFile"></slot>
      <slot v-else></slot>
      <span v-if="showFileName && type == 'select'">{{fileName}}</span>
    </div>
    <span v-if="showFileName && type == 'drag'">{{fileName}}</span>
  </div>
</template>
<script>
  import XLSX from 'xlsx'
  const prefixCls = 'h-upload' //套用upload 样式
  import { oneOf } from '../../util/tools.js';
  export default {
    data () {
      return {
        prefixCls: prefixCls,
        dragOver: false,
        fileName: '',
      }
    },
    props: {
      type: {
        type: String,
        validator (value) {
          return oneOf(value, ['select', 'drag']);
        },
        default: 'select'
      },
      accept: {
        type: String,
        default: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
      },
      showFileName: {
        type: Boolean,
        default: true
      },
      selfConfig: {
        type: Boolean,
        default: false
      },
      excelIdx: { //一个文件的第几张表
        type: [String, Number],
        default: '1',
        validator (value) {
          if (parseInt(value) > 0) {
            return parseInt(value)
          }
        }
      },
      excelSize: { //导入几张表
        type: [String, Number],
        default: '1',
        validator (value) {
          if (parseInt(value) > 0) {
            return parseInt(value)
          } else if (value == 'all') {
            return value
          }
        }
      }
    },
    computed: {
      wrapCls () {
        return [
            `${prefixCls}`,
            {
              [`${prefixCls}-self`]: this.selfConfig
            }
          ]
      },
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-select`]: this.type === 'select',
            [`${prefixCls}-drag`]: this.type === 'drag',
            [`${prefixCls}-dragOver`]: this.type === 'drag' && this.dragOver
          }
        ]
      }
    },
    methods: {
      readExcel (file) {
        const fileReader = new FileReader()
        // 暂时不支持IE
        let tableColumnsTitle = []
        let tableData = []
        let sheetData = {}
        let that = this
        this.fileName = file[0].name
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result
            const workbook = XLSX.read(data, {
              type: 'binary'
            })
            let fromTo = ''
            let excelSize = this.excelSize
            let excelIdx = this.excelIdx
            if (this.excelSize == 'all') {
              excelSize = Object.entries(workbook.Sheets).length
              excelIdx = 0
            } else {
              excelIdx = parseInt(this.excelIdx) - 1
              excelSize = parseInt(this.excelSize)
            }
            Object.entries(workbook.Sheets).forEach(([sheet, value], index) => {
              if (workbook.Sheets.hasOwnProperty(sheet) && (index >= excelIdx && index < excelIdx + excelSize)) {
                fromTo = workbook.Sheets[sheet]['!ref']
                sheetData[sheet] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {defval:""})
                tableData.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {defval:""}))
              }
            })
            if (tableData.length > 0) {
              for (let tableDataItem of tableData) {
                if (tableDataItem && tableDataItem.length > 0) {
                  tableColumnsTitle.push(Object.keys(tableDataItem[0]).filter(item => item.indexOf('__EMPTY') < 0))
                } else {
                  tableColumnsTitle.push([])
                }
              }
            }
            /* 
             * sheetData格式
             * {sheetname: dataObj}
             * tableColumnsTitle格式
             * [[sheet1ColumnTitle], [sheet2ColumnTitle]]
             */
            that.$emit('on-choose-file', sheetData, tableColumnsTitle)
          } catch (e) {
            this.$hMessage.warning('文件类型不正确')
            return false;
          }
        }
        fileReader.readAsBinaryString(file[0])
      },
      handleClick () {
        this.$refs.input.click()
      },
      onDrop (e) {
        this.dragOver = false;
        this.readExcel(e.dataTransfer.files)
      },
      handleChange (e) {
        const files = e.target.files
        if (!files) return
        this.readExcel(files)
        this.$refs.input.value = null
      },
    }
  }
</script>