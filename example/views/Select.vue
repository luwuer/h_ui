<template>
  <div>
    <div>
      <h1>Select组件</h1>
      <p>选择器支持单选、多选、搜索，以及键盘快捷操作。</p>
      <h1>基础用法</h1>
      <p>使用v-model双向绑定数据,默认为单选</p>
      <p>单选时，value只接受字符串和数字类型，多选时，value只接受数组类型</p>
      <Button @on-click="testClick(true)">获取焦点</Button>
      <Button @on-click="testClick(false)">失去焦点</Button>
      <h-select ref="test" placement="bottom-start" :dropWidth="400" @on-blur="blurH"></h-select>
      <h-select v-model="model34"
                style="width:120px"
                @on-change="change"
                @on-scroll="scroll"
                algin="right"
                placement="top-start"
                :dropWidth="400"
                :setDefSelect="true">
        <h-option value="index">
          <a href=http://www.google.com/>link</a>
        </h-option>
        <h-option v-for="item in cityList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</h-option>
      </h-select>
      <h-button @click="fuzhi">赋值</h-button>
      <h-button @click="qk">清空</h-button>
      {{model34}}
      <!-- <h-select v-model="model44"
                multiple
                hideMult
                style="width:320px"
                :isString="true"
                isCheckall
                @on-change="change"
                @on-scroll="scroll"
                :isComputed="isComputed"
                noMoreText="哈哈哈哈"
                algin="center">
        <h-option v-for="item in cityList"
                  multiple
                  :value="item.value"
                  :key="item.value">{{ item.label }}</h-option>
      </h-select> -->
      
       <h-select v-model="model44"
                multiple
                style="width:320px"
                isCheckall
                @on-change="change"
                @on-scroll="scroll"
                :isComputed="isComputed"
                noMoreText="哈哈哈哈"
                :specialIndex="true"
                algin="center">
        <h-option :value="-1"
                  key="-1">-1 所有</h-option>
        <h-option v-for="item in cityList"
                  multiple
                  :value="Number(item.value)"
                  :key="item.value">{{ item.label }}</h-option>
      </h-select>
      {{model44}}
      <br>
      <div>
        <h-select v-model="model1"
                  label-in-value
                  width="200"
                  @on-change="change"
                  :setDefSelect="true"
                  showTitle>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
      </div>
      {{model1}}
      <h1>
        设置select尺寸
      </h1>
      <p>设置size属性为large或small，将输入框设置为大和小尺寸，不设置为默认中尺寸</p>
      <div>
        <span>小:</span>
        <h-select v-model="model2"
                  size="small"
                  width="100">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <span>正常:</span>
        <h-select v-model="model3"
                  width="100">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <span>大:</span>
        <h-select v-model="model4"
                  size="large"
                  width="100">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
      </div>
      <h1>
        disabled:禁用(可直接配置disabled，或配置disabled属性为true)
      </h1>
      <div>
        <span>select禁用：</span>
        <h-select v-model="model5"
                  width="200"
                  disabled>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <h-select v-model="model5"
                  width="200"
                  readonly>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <h-select v-model="model5"
                  width="200"
                  :editable="false">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <span>option禁用：</span>
        <h-select v-model="model5"
                  width="200">
          <h-option value="beijing">北京市</h-option>
          <h-option value="shanghai"
                    disabled>上海市</h-option>
          <h-option value="shenzhen">深圳市</h-option>
        </h-select>
        <span>正常;</span>
        <h-select v-model="model6"
                  width="200">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
      </div>
      <h1>
        clearable:选择后可清空输入框选项(可直接配置clearable，或配置clearable属性为true)注意：仅适用于单选模式
      </h1>
      <div>
        <h1>黄沙</h1>
        <span>可清空</span>
        <h-select v-model="model6"
                  width="200"
                  clearable>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
      </div>
      <h1>
        option-group:选项分组
      </h1>
      <div>
        <span>分组:</span>
        <h-select v-model="model7"
                  width="200"
                  multiple
                  :isString="true"
                  isCheckall>
          <h-option-group label="热门城市">
            <h-option v-for="(item, index) in cityList1"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</h-option>
          </h-option-group>
          <h-option-group label="其他城市">
            <h-option v-for="(item, index) in cityList2"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</h-option>
          </h-option-group>
        </h-select>
        {{model7}}
      </div>
      <h1>
        自定义select下拉选项格式(一般会在option中国绑定label显示)
      </h1>
      <div>
        <span>自定义:</span>
        <h-select v-model="model8"
                  width="200">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            <span>{{ item.name }}</span>
            <span style="float:right;color:#ccc;position:absolute;right:8px">{{ item.id }}</span>
          </h-option>
        </h-select>
      </div>
      <h1>
        multiple:多选（可直接配置 multiple，或配置 multiple属性为true），多选模式下。model接收数组类型的数据，返回数组类型的数据
      </h1>
      <div>
        <span>多选123:</span>
        <h-select v-model="model9"
                  width="260"
                  multiple
                  size="large"
                  :isString="true"
                  showTitle>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        {{model9}}
      </div>
      <h1>
        filterable:可搜索（可直接配置 filterable，或配置 filterable属性为true），多选模式下可以使用键盘delete键删除最后一个选项
      </h1>
      <div>
        <span>单选可搜索:</span>
        <h-select v-model="model10"
                  width="200"
                  @on-blur="blurH"
                  filterable>
          <h-option :value="3">{{'<你>'}}</h-option>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <span>多选可搜索:</span>
        <h-select v-model="model11"
                  width="200"
                  multiple
                  @on-blur="blurH"
                  filterable
                  :isString="true"
                  isCheckall>
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        {{model11}}
        <h2>搜索框在下</h2>
        <span>单选可搜索:</span>
        <h-select v-model="model10"
                  width="200"
                  filterable
                  @on-blur="blurH"
                  :showBottom="true"
                  searchHolder="123"
                  :transfer="true">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        <span>多选可搜索:</span>
        <h-select v-model="model11"
                  width="200"
                  multiple
                  filterable
                  @on-blur="blurH"
                  :isString="true"
                  :showBottom="true"
                  checkToHead
                  :transfer="true">
          <h-option v-for="(item, index) in uList"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</h-option>
        </h-select>
        {{model11}}
      </div>
      <h1>
        remote:远程可搜索，需同时设置 filterable、remote、remote-method、loading 四个 props，其中 loading 用于控制是否正在搜索中，remote-method 是远程搜索的方法。设置初始显示值，需设置 label 属性。
      </h1>
      <div>
        <span>远程搜索:</span>
        <h-select width="200"
          v-model="model13"
          filterable
          remote
          @on-blur="blurH"
          :remote-method="remoteMethod1"
          :loading="loading1">
          <h-option v-for="option in options1"
            :value="option.value"
            :key="option.value">{{option.label}}</h-option>
        </h-select>
        {{model13}}
      </div>
      <h-select v-model="mode224"
                not-found-text="新设置的为空显示的内容"
                @on-blur="blurH"
                filterable>
        <h-option v-for="item in cityList224"
                  :value="item.value"
                  :key="item.value">{{ item.value }}</h-option>
      </h-select>
      <h2>test 1</h2>
      {{cy.value1}}
      <h-select v-model="cy.value1"
                width="260"
                multiple
                size="large"
                :isString="true"
                showTitle
                >
        <h-option v-for="item in cy.options1"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</h-option>
      </h-select>
      {{cy.value2}}
      <h-select v-model="cy.value2"
                width="260"
                size="large"
                :isString="true"
                showTitle
                on-change="cy_change_test">
        <h-option v-for="item in cy.options1"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</h-option>
      </h-select>
    </div>
  </div>
</template>

<script>
const data = [
  // {
  //   value: 'beijing1',
  //   label: '<你好>'
  // },
  // {
  //   value: 'beijing',
  //   label: '北京市北京市北京市北京市北京市北京市'
  // },
  // {
  //   value: 'shanghai',
  //   label: '上海市上海市上海市上海市上海市上海市上海市'
  // },
  // {
  //   value: 'shenzhen',
  //   label: '深圳市'
  // },
  // {
  //   value: 'hangzhou',
  //   label: '杭州市'
  // },
  // {
  //   value: 'shenzhen111',
  //   label: '南京市111'
  // },
  // {
  //   value: 'shenzhen222',
  //   label: '重庆市222'
  // },
  // {
  //   value: 'shenzhen223',
  //   label: '重庆市223'
  // },
  // {
  //   value: 'shenzhen224',
  //   label: '重庆市224'
  // },
  // {
  //   value: 'shenzhen225',
  //   label: '重庆市225'
  // },
  // {
  //   value: 'shenzhen226',
  //   label: '重庆市226'
  // },
  // {
  //   value: 'shenzhen227',
  //   label: '重庆市227'
  // },
  {
    value: '1',
    label: '1'
  },
  {
    value: '2',
    label: '2'
  },
  {
    value: '3',
    label: '3'
  },
  {
    value: '4',
    label: '4'
  },

  {
    value: '5',
    label: '5'
  },
  {
    value: '6',
    label: '6'
  },
  {
    value: '7',
    label: '7'
  },
  {
    value: '8',
    label: '8'
  },
  {
    value: '9',
    label: '9'
  },
  {
    value: '10',
    label: '10'
  },
  {
    value: '11',
    label: '11'
  },
  {
    value: '12',
    label: '12'
  },
  {
    value: '13',
    label: '13'
  },
  {
    value: '14',
    label: '14'
  },
  {
    value: '15',
    label: '15'
  },
  {
    value: '16',
    label: '16'
  },
  {
    value: '17',
    label: '17'
  },
  {
    value: '18',
    label: '18'
  },
  {
    value: '19',
    label: '19'
  }
]
let bigData=[]
for(let i=0;i<1000;i++){
  let obj={}
  obj.value=i;
  obj.label='lable'+i;
  bigData.push(obj);
}

export default {
  data() {
    return {
      canPage: true,
      isComputed: false,
      cityList: [],
      model34: '',
      model44: [1,2],
      mode224: '',
      model1: '',
      model2: '',
      model3: '',
      model4: '',
      model5: 'beijing',
      model6: '',
      model7: '',
      model8: '',
      model9: '',
      model10: '',
      model11: '',
      model13: 'hangzhou',
      loading1: false,
      options1: [
        {
          value: 'hangzhou',
          label: '杭州市'
        },
        {
          value: 'nanjing',
          label: '南京市'
        },
        {
          value: 'chongqing',
          label: '重庆市'
        }
      ],
      mu: true,
      mu1: true,
      d: [],
      uList: [],
      list: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New hampshire',
        'New jersey',
        'New mexico',
        'New york',
        'North carolina',
        'North dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode island',
        'South carolina',
        'South dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West virginia',
        'Wisconsin',
        'Wyoming'
      ],
      cityList1: [
        {
          value: 'beijing',
          label: '北京市'
        },
        {
          value: 'shanghai',
          label: '上海市'
        },
        {
          value: 'shenzhen',
          label: '深圳市'
        }
      ],
      cityList2: [
        {
          value: 'hangzhou',
          label: '杭州市'
        },
        {
          value: 'nanjing',
          label: '南京市'
        },
        {
          value: 'chongqing',
          label: '重庆市'
        }
      ],
      cityList224: '',
      cy: {
        flag: true,
        value1: '',
        value2: '',
        options1: [
          {
            value: '1',
            label: '&nbsp;<a herf="www.google.com"></a><script><\/script>'
          },
          {
            value: '2',
            label: '从前有座山山上有座庙庙里有个老和尚和一个小和尚'
          },
          {
            value: '3',
            label: '水缸'
          },
          {
            value: '4',
            label: '扁担儿'
          }
        ]
      },
      bigData:bigData,
    }
  },
  methods: {
    cy_change_test(val) {
      console.log(val)
    },
    testClick(val) {
      if (val) {
        this.$refs.test.focus()
      } else {
        this.$refs.test.blur()
      }
    },
    fuzhi() {
      this.cityList = data.slice(0, 2)
    },
    qk() {
      this.cityList = []
    },
    scroll(num) {
      let _this = this
      if (num <= 1 && _this.canPage) {
        _this.canPage = false
        let length = _this.cityList.length
        setTimeout(() => {
          let arr = data.slice(length, length + 10)
          if (arr.length > 0) {
            _this.cityList = _this.cityList.concat(arr)
            _this.canPage = true
          } else {
            this.isComputed = true
          }
        }, 200)
      }
    },
    blurH(){
      console.log('失去焦点了')
    },
    change(e) {
      console.log(e)
    },
    clear() {
      this.d = []
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loading1 = true
        setTimeout(() => {
          this.loading1 = false
          this.options1 = []
          const list = this.list.map(item => {
            return {
              value: item,
              label: item
            }
          })
          this.options1 = list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.options1 = this.list.map(item => {
          return {
            value: item,
            label: item
          }
        })
      }
    }
  },
  mounted() {
    var _this = this
    this.cityList = []
    var timer = setTimeout(() => {
      _this.cityList = data.slice(0, 10)
    }, 10)
    this.uList = [
      { id: '1', name: '中国' },
      { id: '2', name: '美国' },
      { id: '3', name: '韩国1' },
      { id: '4', name: '韩国2' },
      { id: '5', name: '韩国3' },
      { id: '6', name: '韩国4' },
      { id: '7', name: '韩国5' },
      { id: '8', name: '韩国6' }
    ]
  }
}
</script>
<style>
p {
  font-size: 18px;
}
</style>
