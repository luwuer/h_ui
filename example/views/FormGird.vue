<template>
<div>
 <h-tabs value="name1">
  <h-tab-pane label="标签一" name="name1">
    <h-form-gird 
      ref="formGird"
      v-model="formItem1" 
      :columns="fcolumn" 
      :data="formData" 
      height="200" 
      :autoClear="false" 
      :stripe="true"
      :border="true"
      :showHeader="true"
      noDataText="123"
      :canDrag="true"
      :loading="false"
      @on-row-click="rowClick"
      >
      <h-form ref="formItem1" :model="formItem1" :compareModel="formItem2" :label-width="80"  cols="2">
        <h-form-item label="输入框" prop="input" required>
          <h-input v-model="formItem1.input" placeholder="请输入"></h-input>
        </h-form-item>
        <h-form-item label="日期控件">
          <h-row>
            <h-col span="11">
              <h-form-item prop="date" required>
                <h-datePicker type="date" placeholder="选择日期" v-model="formItem1.date"></h-datePicker>
              </h-form-item>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-form-item prop="time" required>
                <h-timePicker type="time" placeholder="选择时间" v-model="formItem1.time"></h-timePicker>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item label="选择器" prop="select" required>
          <h-select v-model="formItem1.select" filterable>
            <h-option value="beijing">北京市</h-option>
            <h-option value="shanghai">上海市</h-option>
            <h-option value="shenzhen">深圳市</h-option>
          </h-select>
        </h-form-item>
        <h-form-item label="金额框" prop="money" required>
          <h-typefield v-model="formItem1.money">
            <h-select v-model="select2" placeholder="" slot="append" style="width: 45px" :isArrow="false" :clearable="false" :tranfer="true">
            <h-option value="com">.com</h-option>
            <h-option value="org">.org</h-option>
            <h-option value="io">.io</h-option>
          </h-select>
          </h-typefield>
        </h-form-item>
        <h-form-item label="单选框" prop="radio" required>
          <h-radio-group v-model="formItem1.radio">
            <h-radio label="male">男</h-radio>
            <h-radio label="female">女</h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item label="多选框" prop="checkbox" required>
          <h-checkbox-group v-model="formItem1.checkbox">
              <h-checkbox label="吃饭"></h-checkbox>
              <h-checkbox label="睡觉"></h-checkbox>
              <h-checkbox label="跑步"></h-checkbox>
              <h-checkbox label="看电影"></h-checkbox>
          </h-checkbox-group>
        </h-form-item>
        <h-form-item label="特殊日期" required prop="fatdate" required>
          <h-fast-date v-model="formItem1.fatdate"></h-fast-date>
        </h-form-item>
        <h-form-item label="下拉表" prop='slider' required>
          <h-select-table v-model="formItem1.slider" >
            <h-table-option border :columns="columns1" :data="data1"></h-table-option>
          </h-select-table>
        </h-form-item>
        <h-form-item label="下拉树" prop='tree' required>
          <h-select-tree v-model="formItem1.tree" style="width:200px" :data="baseData1" placement="top" placeholder="你好"></h-select-tree>
        </h-form-item>
        <h-form-item label="文本域" prop="textarea" required>
          <h-input v-model="formItem1.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <Button type="primary" @on-click="submit1">提交</Button>
        <Button >取消</Button>
      </div>
	   
    </h-form-gird>
    </h-tab-pane>
    <h-tab-pane label="标签二" name="name2">
      <h-form-gird 
        ref="formGird1"
        v-model="formItem2" 
        :columns="fcolumn" 
        :data="formData" 
        height="200" 
        :autoClear="false" 
        :stripe="true"
        :border="true"
        :showHeader="true"
        noDataText="123"
        :canDrag="true"
        :loading="false"
        @on-row-click="rowClick"
        >
        <h-form ref="formItem2" :model="formItem2" :compareModel="formItem2" :label-width="80"  cols="2">
          <h-form-item label="输入框" prop="input" required>
            <h-input v-model="formItem2.input" placeholder="请输入"></h-input>
          </h-form-item>
          <h-form-item label="日期控件">
            <h-row>
              <h-col span="11">
                <h-form-item prop="date" required>
                  <h-datePicker type="date" placeholder="选择日期" v-model="formItem2.date"></h-datePicker>
                </h-form-item>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-form-item prop="time" required>
                  <h-timePicker type="time" placeholder="选择时间" v-model="formItem2.time"></h-timePicker>
                </h-form-item>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item label="选择器" prop="select" required>
            <h-select v-model="formItem2.select" filterable>
              <h-option value="beijing">北京市</h-option>
              <h-option value="shanghai">上海市</h-option>
              <h-option value="shenzhen">深圳市</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="金额框" prop="money" required>
            <h-typefield v-model="formItem2.money">
              <h-select v-model="select2" placeholder="" slot="append" style="width: 45px" :isArrow="false" :clearable="false" :tranfer="true">
              <h-option value="com">.com</h-option>
              <h-option value="org">.org</h-option>
              <h-option value="io">.io</h-option>
            </h-select>
            </h-typefield>
          </h-form-item>
          <h-form-item label="单选框" prop="radio" required>
            <h-radio-group v-model="formItem2.radio">
              <h-radio label="male">男</h-radio>
              <h-radio label="female">女</h-radio>
            </h-radio-group>
          </h-form-item>
          <h-form-item label="多选框" prop="checkbox" required>
            <h-checkbox-group v-model="formItem2.checkbox">
                <h-checkbox label="吃饭"></h-checkbox>
                <h-checkbox label="睡觉"></h-checkbox>
                <h-checkbox label="跑步"></h-checkbox>
                <h-checkbox label="看电影"></h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item label="特殊日期" required prop="fatdate" required>
            <h-fast-date v-model="formItem2.fatdate"></h-fast-date>
          </h-form-item>
          <h-form-item label="下拉表" prop='slider' required>
            <h-select-table v-model="formItem2.slider" >
              <h-table-option border :columns="columns1" :data="data1"></h-table-option>
            </h-select-table>
          </h-form-item>
          <h-form-item label="下拉树" prop='tree' required>
            <h-select-tree v-model="formItem2.tree" style="width:200px" :data="baseData1" placement="top" placeholder="你好"></h-select-tree>
          </h-form-item>
          <h-form-item label="文本域" prop="textarea" required>
            <h-input v-model="formItem2.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
          </h-form-item>
        </h-form>
        <div slot="footer">
          <Button type="primary" @on-click="submit1">提交</Button>
          <Button >取消</Button>
        </div>
      
      </h-form-gird>
    </h-tab-pane>
  </h-tabs>
  <Button @on-click="getAllData"> 获取所有数据</Button>
  <span>{{formItem1}}</span>
</div>
</template>
<script>
  export default {
    data () {
      return{
        fcolumn:[
          {key:'check',title:' ',type:'index',width:100},
          {key:'input',title:'输入框',align:'center'},
          {key:'select',title:'选择器',align:'right'},
          {key:'radio',title:'单选框'},
          {key:'money',title:'金额框'},
          {key:'checkbox',title:'多选框'},
          {key:'fatdate',title:'特殊日期'},
        ],
        formData:[
          {
            input: '1',
            select: '',
            radio: '',
            money: '',
            checkbox: [],
            fatdate: '',
            date: '',
            time: '',
            slider: '',
            tree:'',
            textarea: '1',
          }
        ],
        phone:0,
        lists:[{data_value:'男'},{data_value:'女'}],
        model1:'',
        changeform:false,
        formItem1: {
          input: '1',
          select: [],
          radio: '',
          money: '',
          checkbox: [],
          fatdate: '',
          date: '',
          time: '',
          slider: '',
          tree:'',
          textarea: '',
          cascader:[]
        },
        formItem2:{
          input: '1',
          select: '',
          radio: '',
          money: '',
          checkbox: [],
          fatdate: '',
          date: '',
          time: '',
          slider: '',
          tree:'',
          textarea: '',
        },
        data2: [{
          value: 'beijing',
          label: '北京',
          children: [
            {
              value: 'gugong',
              label: '故宫'
            },
            {
              value: 'tiantan',
              label: '天坛'
            },
            {
              value: 'wangfujing',
              label: '王府井'
            }
          ]
          }, 
          {
            value: 'jiangsu',
            label: '江苏',
            children: [
              {
                value: 'nanjing',
                label: '南京',
                children: [
                  {
                      value: 'fuzimiao',
                      label: '夫子庙',
                  }
                ]
              },
              {
                value: 'suzhou',
                label: '苏州',
                children: [
                  {
                    value: 'zhuozhengyuan',
                    label: '拙政园',
                  },
                  {
                    value: 'shizilin',
                    label: '狮子林',
                  }
                ]
              }
            ],
          }
        ],
        formValid: {
          user: '你好',
          stringInput:'',
          password: '',
          test1: '',
          test2: ''
        },
        select1:'',
        select2:'',
        stringRule:['email'],
        regRule: [{test:/^[a-zA-Z]+$/, message:'不全是字母',trigger:'blur'}],
        columns1: [
          {
            title: '姓名',
            key: 'name',
            ellipsis: true
          },
          {
            title: '年龄',
            key: 'age',
            hiddenCol:true
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data1:[
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
            // _highlight: true//默认选择当前项
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道'
          },
        ],
        baseData1: [
          {
            title: 'parent',
            id: '1-0',
            children: [
              {
                title: 'child1',
                id: '1-1',
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2'
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],
      }
    },
    methods: {
      rowClick(e){
        console.log(e)
      },
	  submit1(){
        console.log("tijiao")
      },
      getAllData(){
        console.log(this.$refs.formGird.getAllData())
      }
    }
  }
</script>




<!-- <template>
  <div>
    <h-form-gird 
      ref="formGird"
      v-model="formItem1" 
      :columns="fcolumn" 
      :data="fdata" 
      height="200" 
      :autoClear="false" 
      :stripe="true"
      :border="true"
      :showHeader="true"
      noDataText="123"
      :canDrag="true"
      :loading="false"
      @on-row-click="rowClick"
      >
      <h-form ref="formItem1" :model="formItem1" :compareModel="formItem2" :label-width="80" errorFocus cols="2">
        <h-form-item label="输入框" prop="input" required>
          <h-input v-model="formItem1.input" placeholder="请输入"></h-input>
        </h-form-item>
        <h-form-item label="日期控件">
          <h-row>
            <h-col span="11">
              <h-form-item prop="date" required>
                <h-datePicker type="date" placeholder="选择日期" v-model="formItem1.date"></h-datePicker>
              </h-form-item>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-form-item prop="time" required>
                <h-timePicker type="time" placeholder="选择时间" v-model="formItem1.time"></h-timePicker>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item label="选择器" prop="select" required>
          <h-select v-model="formItem1.select" filterable>
            <h-option value="beijing">北京市</h-option>
            <h-option value="shanghai">上海市</h-option>
            <h-option value="shenzhen">深圳市</h-option>
          </h-select>
        </h-form-item>
        <h-form-item label="金额框" prop="money" required>
          <h-typefield v-model="formItem1.money">
            <h-select v-model="select2" placeholder="" slot="append" style="width: 45px" :isArrow="false" :clearable="false" :tranfer="true">
            <h-option value="com">.com</h-option>
            <h-option value="org">.org</h-option>
            <h-option value="io">.io</h-option>
          </h-select>
          </h-typefield>
        </h-form-item>
        <h-form-item label="单选框" prop="radio" required>
          <h-radio-group v-model="formItem1.radio">
            <h-radio label="male">男</h-radio>
            <h-radio label="female">女</h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item label="多选框" prop="checkbox" required>
          <h-checkbox-group v-model="formItem1.checkbox">
              <h-checkbox label="吃饭"></h-checkbox>
              <h-checkbox label="睡觉"></h-checkbox>
              <h-checkbox label="跑步"></h-checkbox>
              <h-checkbox label="看电影"></h-checkbox>
          </h-checkbox-group>
        </h-form-item>
        <h-form-item label="特殊日期" required prop="fatdate" required>
          <h-fast-date v-model="formItem1.fatdate"></h-fast-date>
        </h-form-item>
        <h-form-item label="下拉表" prop='slider' required>
          <h-select-table v-model="formItem1.slider" >
            <h-table-option border :columns="columns1" :data="data1"></h-table-option>
          </h-select-table>
        </h-form-item>
        <h-form-item label="下拉树" prop='tree' required>
          <h-select-tree v-model="formItem1.tree" style="width:200px" :data="baseData1" placement="top" placeholder="你好"></h-select-tree>
        </h-form-item>
        <h-form-item label="文本域" prop="textarea" required>
          <h-input v-model="formItem1.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <Button type="primary" >提交</Button>
        <Button >取消</Button>
      </div>
    </h-form-gird>
    <Button @on-click="getAllData"> 获取所有数据</Button>
  </div> 
</template>

<script>
  export default {
    data () {
      return {
        fcolumn:[
          {key:'check',title:' ',type:'selection',width:100},
          {key:'input',title:'输入框',align:'center'},
          {key:'select',title:'选择器',align:'right'},
          {key:'radio',title:'单选框'},
          {key:'money',title:'金额框'},
          {key:'checkbox',title:'多选框'},
          {key:'fatdate',title:'特殊日期'},
        ],
        fdata:[
          {
            input: '1',
            select: '',
            radio: '',
            money: '',
            checkbox: [],
            fatdate: '',
            date: '',
            time: '',
            slider: '',
            tree:'',
            textarea: '1',
          }
        ],
        phone:0,
        lists:[{data_value:'男'},{data_value:'女'}],
        model1:'',
        changeform:false,
        formItem1: {
          input: '1',
          select: [],
          radio: '',
          money: '',
          checkbox: [],
          fatdate: '',
          date: '',
          time: '',
          slider: '',
          tree:'',
          textarea: '',
          cascader:[]
        },
        formItem2:{
          input: '1',
          select: '',
          radio: '',
          money: '',
          checkbox: [],
          fatdate: '',
          date: '',
          time: '',
          slider: '',
          tree:'',
          textarea: '',
        },
        data2: [{
          value: 'beijing',
          label: '北京',
          children: [
            {
              value: 'gugong',
              label: '故宫'
            },
            {
              value: 'tiantan',
              label: '天坛'
            },
            {
              value: 'wangfujing',
              label: '王府井'
            }
          ]
          }, 
          {
            value: 'jiangsu',
            label: '江苏',
            children: [
              {
                value: 'nanjing',
                label: '南京',
                children: [
                  {
                      value: 'fuzimiao',
                      label: '夫子庙',
                  }
                ]
              },
              {
                value: 'suzhou',
                label: '苏州',
                children: [
                  {
                    value: 'zhuozhengyuan',
                    label: '拙政园',
                  },
                  {
                    value: 'shizilin',
                    label: '狮子林',
                  }
                ]
              }
            ],
          }
        ],
        formValid: {
          user: '你好',
          stringInput:'',
          password: '',
          test1: '',
          test2: ''
        },
        select1:'',
        select2:'',
        stringRule:['email'],
        regRule: [{test:/^[a-zA-Z]+$/, message:'不全是字母',trigger:'blur'}],
        columns1: [
          {
            title: '姓名',
            key: 'name',
            ellipsis: true
          },
          {
            title: '年龄',
            key: 'age',
            hiddenCol:true
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data1:[
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
            // _highlight: true//默认选择当前项
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道'
          },
        ],
        baseData1: [
          {
            title: 'parent',
            id: '1-0',
            children: [
              {
                title: 'child1',
                id: '1-1',
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2'
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],
        firstValc: 'parent',
      }
    },
    methods: {
      rowClick(e){
        console.log(e);
      },
      changeform1(){
        this.changeform = !this.changeform;
      },
      handleSubmit (name) {
        let _this=this
        this.$refs[name].validate((valid) => {
            if (valid) {
              _this.$hMessage.success('提交成功!');
            } else {
              _this.$hMessage.error('表单验证失败!');
            }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      totest() {
        this.$refs.changeDrop.focus();
      },
      getAllData(){
        console.log(this.$refs.formGird.getAllData())
      }
    }
  }
</script>
-->
