<template>
  <div @click="exportFile">
    <slot>
      <h-button type="ghost">导出文件</h-button>      
    </slot>
  </div>
</template>
<script>
  import XLSX from 'xlsx'
  import { oneOf } from '../../util/tools';
  export default {
    data () {
      return {
        rebuildData: []
      }
    },
        
    /* 一个文件：
     * fileName: 文件名
     * fileType: 文件类型【xls/xlsx】
     * 每个文件的数据集：
     * 表头
     * 数据
     * 表格标题
     * 单表名称
     * sheetNames: 文件名集合 ['sheet1', 'sheet2']
     * sheetTitleNames: 单表标题集合:  ['test测试', 'test2测试]
     * sheetHeaders: 单表表头集合[
     *  [
     *    {
     *      key: 'col1',
     *      title: '列1',
     *      exportRender: FUNC
     *    }, 
     *    {
     *      key: 'col2',  
     *      title: '列2'
     *      exportRender: FUNC
     *    }
     *  ],
     *  []
     * ]
     * sheetSelfData: [[[表头], [数据1], [数据2]...], []] // 表格数据完全由外部定义[也是所有导出时的最终数据格式]
     * sheetTableData: 单表数据集合[ // 按照表格解析
     *  [    
     *    {
     *      'col1': '12312312',
     *      'col2': 'sfsdfsdf'
     *    }
     *    {
     *      '列1': '12312312',
     *      '列2': 'sfsdfsdf'
     *    },
     *    {
     *      '列1': '2234',
     *      '列2': 's23asdf'
     *    }
     *  ],
     *  []
     * ]
    */
    props: {
      // 文件名
      fileName: {
        type: String,
        default: 'test'
      },
      // 文件类型
      fileType: {
        type: String,
        validator (value) {
          return oneOf(value, ['xls', 'xlsx'])
        },
        default: 'xls'
      },
      // 单表类型 table 表示组件内部进行表格数据转换，self 表示表格内部不进行数据转换，给什么样的数据便导出什么样的数据
      sheetType: {
        type: String,
        validator (value) {
          return oneOf(value, ['self', 'table'])
        },
        default: 'self'
      },
      // 单表名称集合
      sheetNames: {
        type: Array,
        defaule () {
          return []
        }
      },
      // 标题名称集合
      sheetTitleNames: {
        type: Array,
        defaule () {
          return []
        }
      },
      // 单表表头集合
      sheetHeaders: {
        type: Array,
        defaule () {
          return []
        }
      },
      // 单表表格数据集合
      sheetTableData: {
        type: Array,
        defaule () {
          return []
        }
      },
      // 单表自定义数据集合
      sheetSelfData: {
        type: Array,
        defaule () {
          return []
        }
      },
      // 无导出数据提示
      noTipText: {
        type: String, 
        default: '暂无导出数据'
      }
    },
    watch: {
      sheetHeaders: {
        handler (val) {
          this.rebuildData = this.makeData()
        },
        deep: true
      },
      sheetTableData: {
        handler (val) {
          this.rebuildData = this.makeData()
        },
        deep: true        
      },
      sheetSelfData: {
        handler (val) {
          this.rebuildData = this.makeData()
        },
        deep: true 
      }
    },
    methods: {
      // 构建rebuildData最终导出数据 格式为[[[表头], [数据1], [数据2]...], []]
      makeData () {
        let rebuildDataList = []
        if (this.sheetType == 'table' && this.sheetTableData) {
          if (this.sheetNames.length > 0 || this.sheetHeaders.length > 0 || this.sheetTableData.length > 0) {
            // 考虑数据可能为空的情况
            let maxLength = Math.max(this.sheetNames.length, this.sheetHeaders.length, this.sheetTableData.length)
            for (let i = 0; i < maxLength; i++) {
              let headerData = this.makeSheetHeaderData(i)
              let tableData = this.makeSheetTableData(i)
              let sheetData = []
              if (headerData.length > 0) sheetData.push(headerData)
              sheetData = tableData.length > 0 ? sheetData.concat(tableData) : sheetData
              rebuildDataList.push(sheetData)
            }
          } 
        } else if (this.sheetType == 'self' && this.sheetSelfData) {
          rebuildDataList = this.sheetSelfData
        } 
        return rebuildDataList
      },
      // 返回当前sheet header list 对header数据进行转化
      makeSheetHeaderData (index) {
        let sheetHeader = this.sheetHeaders[index] ? this.sheetHeaders[index] : []
        let curHeaderList = []
        if (sheetHeader.length > 0) {
          sheetHeader.forEach((header) =>  {
            curHeaderList.push(header.title ? header.title : header.key ? header.key : '')
          })
        }
        return curHeaderList
      },
      // 对table 数据进行转化      
      makeSheetTableData (index) {
        let tableData = []
        // 数据
        let sheetTableData = this.sheetTableData[index] ? this.sheetTableData[index] : []
        // 表头
        let tHeader = this.sheetHeaders[index] ?  this.sheetHeaders[index] : []
        if (sheetTableData.length > 0) {
          if (tHeader.length > 0) {
            sheetTableData.forEach((row) => {
              row = tHeader.map((item, index) => {
                let cellData 
                if (item.key && row[item.key] && item.exportRender) {
                  cellData = item.exportRender(row[item.key])
                } else  {
                  cellData = typeof row[item.key] !== 'undefined' ? row[item.key] : ''
                }
                return cellData
              })
              tableData.push(row)
            })
          } else {
            // 制造表头
            tableData.push(Object.keys(sheetTableData[0]))
            sheetTableData.forEach((row) => {
              tableData.push(Object.values(row))
            })
          }
        }
        return tableData
      },
      // 导出文件
      exportFile () {
        if (this.rebuildData.length > 0) {
          const wopts = { 
            bookType: this.fileType, 
            bookSST: false, 
            type: 'binary' 
          }
          const wb = { 
            SheetNames: [], 
            Sheets: {}, 
            Props: {} 
          }
          this.rebuildData.forEach((val, index) => {
            let data = {}
            // XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
            if (this.sheetTitleNames && this.sheetTitleNames[index]) {
              // 将一个由对象组成的数组转成sheet；
              data = XLSX.utils.json_to_sheet(val)
              // const range = val[0].length - 1
              data["A1"] = { t: "s", v: this.sheetTitleNames[index]} //设置表格标题
              data["!merges"] = [{//合并第一行数据[B1,C1,D1,E1]
                s: {//s为开始
                  c: 0,//开始列
                  r: 0,//开始取值范围
                  alignment: {horizontal: "center" ,vertical: "center"}
                },
                e: {//e结束
                  // c: range,//结束列
                  c: val && val[0] && val[0].length - 1 > 0 ? val[0].length - 1 : 0,
                  r: 0//结束范围
                }
              }]
            } else {
              // 无标题时，不生成标题
              // 将一个二维数组转成sheet              
              data = XLSX.utils.aoa_to_sheet(val)
            }
            let sheetName = this.sheetNames && this.sheetNames[index] ? this.sheetNames[index] : 'Sheet' + index
            wb.SheetNames[index] = sheetName
            wb.Sheets[sheetName] = data
          })
          let fileName = this.fileName + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType)
          this.saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), fileName)
        } else {
          this.$hMessage.info(this.noTipText)
        } 
      },
      /**
       * 导出列表方法   数据转换
       * @param {*} s
      */
      s2ab (s) {
        if (typeof ArrayBuffer !== 'undefined') {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        } else {
          var buf = new Array(s.length);
          for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
          return buf
        }
      },
      /**
       * 导出列表方法，下载文件
       */
      saveAs (obj, fileName) {//当然可以自定义简单的下载文件实现方式
        var tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj) //绑定a标签
        tmpa.click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(obj) //用URL.revokeObjectURL()来释放这个object URL
        }, 100)
      }
    },
    created() {
      this.rebuildData = this.makeData()
    },
  }
</script> 