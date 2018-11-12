<template>
  <div>
    <h2>self</h2>
    <h-file-export sheetType="self" :sheetSelfData="sheetSelfData" fileName='test状态self'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames'></h-file-export>
    <h2>table</h2>
    <h-file-export sheetType="table" :sheetTableData="sheetTableData" fileName='test状态table'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames' :sheetHeaders="sheetHeaders"></h-file-export>
    <h2>table with render</h2>
    <h-file-export sheetType="table" :sheetTableData="sheetTableData" fileName='test状态table'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames' :sheetHeaders="sheetHeadersWithRender"></h-file-export>
    <h2>多个table sheet--兼容无表头-无标题</h2>
    <h-file-export sheetType="table" :sheetTableData="sheetTableDataMul" fileName='test状态Multable'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames' :sheetHeaders="sheetHeadersWithRenderMul"></h-file-export>
    <h2>xlsx</h2>
     <h-file-export fileType="xlsx" sheetType="self" :sheetSelfData="sheetSelfData" fileName='test状态self'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames'></h-file-export>
    <h2>slot</h2>
    <h-file-export fileType="xlsx" sheetType="self" :sheetSelfData="sheetSelfData" fileName='test状态self'
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames'>
        <h-icon name="home"></h-icon>
    </h-file-export>
    <h2>fileName为空</h2>
    <h-file-export fileType="xlsx" sheetType="self" :sheetSelfData="sheetSelfData" 
        :sheetTitleNames="['test标题名']" :sheetNames='sheetNames'>
        <h-icon name="lock"></h-icon>
    </h-file-export>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        sheetSelfData: [
          [['列表1','列表2'],
          ['111ssd','111sdfsdf']], 
          [['列表1','列表2'],
          ['222211ssd','111sdfsdf']],
          []
        ],
        sheetTitleNames: ['test1测试', 'test2测试', 'test3测试'],
        sheetNames: ['Sheet1test', 'Sheet2test', 'Sheet3test'],
        sheetHeadersWithRender:[
          [
            {
              title: '姓名',
              key: 'name',
            },
            {
              title: '年龄',
              key: 'age',
            },
            {
              title: '省份',
              key: 'province',
            },
            {
              title: '市区',
              key: 'city',
              exportRender: (cell) => {
                return '转换了:' + cell
              }
            },
            {
              title: '地址',
              key: 'address',
            },
            {
              title: '邮编',
              key: 'zip'
            },
          ],
        ],
        sheetHeaders: [
          [
            {
              title: '姓名',
              key: 'name',
            },
            {
              title: '年龄',
              key: 'age',
            },
            {
              title: '省份',
              key: 'province',
            },
            {
              title: '市区',
              key: 'city',
            },
            {
              title: '地址',
              key: 'address',
            },
            {
              title: '邮编',
              key: 'zip'
            },
          ],
        ],
        sheetTableData: [
          [
            {
              name: '王小明',
              age: 18,
              address: '北京市朝阳区芍药居',
              province: '北京市',
              city: '朝阳区',
              zip: 100000
            },
            {
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              province: '北京市',
              city: '海淀区',
              zip: 100000
            },
            {
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              province: '上海市',
              city: '浦东新区',
              zip: 100000
            },
            {
              name: '周小伟',
              age: 26,
              address: '深圳市南山区深南大道',
              province: '广东',
              city: '南山区',
              zip: 100000
            }
          ],
        ],
        sheetHeadersWithRenderMul:[
          [
            {
              title: '姓名',
              key: 'name',
            },
            {
              title: '年龄',
              key: 'age',
            },
            {
              title: '省份',
              key: 'province',
            },
            {
              title: '市区',
              key: 'city',
            },
            {
              title: '地址',
              key: 'address',
            },
            {
              title: '邮编',
              key: 'zip'
            },
          ],
          [
            {
              title: '姓名',
              key: 'name',
              align: 'center',
            },
            {
              title: '年龄',
              key: 'age',
            },
          ],
          []
        ],
        sheetTableDataMul: [
          [
            {
              name: '王小明',
              age: 18,
              address: '北京市朝阳区芍药居',
              province: '北京市',
              city: '朝阳区',
              zip: 100000
            },
            {
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              province: '北京市',
              city: '海淀区',
              zip: 100000
            },
            {
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              province: '上海市',
              city: '浦东新区',
              zip: 100000
            },
            {
              name: '周小伟',
              age: 26,
              address: '深圳市南山区深南大道',
              province: '广东',
              city: '南山区',
              zip: 100000
            }
          ],
          [
            {
              name: '王小明',
              age: 18,
              address: '北京市朝阳区芍药居',
              province: '北京市',
              city: '朝阳区',
              zip: 100000
            },
            {
              name: '张小刚',
              age: 25,
              address: '北京市海淀区西二旗',
              province: '北京市',
              city: '海淀区',
              zip: 100000
            },
          ],
          [
            {
              name: '李小红',
              age: 30,
              address: '上海市浦东新区世纪大道',
              province: '上海市',
              city: '浦东新区',
              zip: 100000
            },
            {
              name: '周小伟',
              age: 26,
              address: '深圳市南山区深南大道',
              province: '广东',
              city: '南山区',
              zip: 100000
            }
          ]
        ],
      }
    }
  }
</script>