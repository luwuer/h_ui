<template>
  <div>
    <h2>format支持2种格式yyyy/MM/dd或者yyyy-MM-dd或者yyMMdd</h2>
    <h-fast-date v-model="val1" format="yyyy/MM/dd" style="width:100px"></h-fast-date>{{val1}}
    <h-fast-date v-model="val2" :setDefault='true' format="yyyy-MM-dd" style="width:100px"></h-fast-date>{{val2}}
    <h-fast-date v-model="val5" placement="top-start" format="yyyyMMdd" style="width:300px"></h-fast-date>{{val5}}
    <h2>clearable支持是否显示可清空按钮</h2>
    <h-fast-date v-model="val3" clearable placeholder="请选择日期"  @on-clear="clear" readonly></h-fast-date>{{val2}}
     <h2>setDefault支持是否显示默认时间</h2>
    <h-fast-date v-model="val4" :setDefault="true" placement="bottom-start" clearable @on-clear="clear"></h-fast-date>{{val4}}
    <h2>范围选择</h2>
    <h-fast-date v-model="valrange1" type="daterange" format="yyyy-MM-dd" placement="top" clearable @on-clear="clear"></h-fast-date>{{valrange1}}
    <h-fast-date type="daterange" placement="bottom-end" placeholder="选择日期" ></h-fast-date>
    <h2>readonly和disabled</h2>
    <h-fast-date readonly type="daterange" ></h-fast-date>
    <h-fast-date disabled type="daterange"></h-fast-date>
    <h2>options设置快捷方式</h2>
    <h-fast-date :options="options1" placeholder="选择日期" style="width: 200px" ></h-fast-date>
    <h2>设置不可用</h2>
    <h-fast-date type="date" :options="options3" placeholder="选择日期" style="width: 200px"></h-fast-date>
    <h2>监听事件</h2>
    <h-fast-date  type="date" placeholder="on-change" @on-change="onChange"></h-fast-date>
    <h-fast-date type="date" placeholder="on-open-change"  @on-open-change="onOpenChange"></h-fast-date>
    <h-fast-date  type="date" placeholder="on-ok" @on-ok="onOk" @on-clear="clear" :confirm="true"></h-fast-date>
    <h2>带确认按钮</h2>
    <h-fast-date  type="date" placement="bottom-end" placeholder="on-change" @on-change="onChange" :confirm="true"></h-fast-date>
    <h-fast-date type="daterange" format="yyyy-MM-dd" placement="bottom-end" placeholder="on-open-change"  @on-open-change="onOpenChange" :confirm="true" clearable></h-fast-date>
    <h-fast-date  type="daterange" format="yyyy-MM-dd" placement="top-end" placeholder="on-ok" @on-ok="onOk" @on-clear="clear" :confirm="true" clearable></h-fast-date>
  </div>
</template>

<script>
export default {
  data() {
    return{
      val1:'',
      val2:'2018-01-01',
      val3:'20180101',
      val4:'',
      val5:20180101,
      valrange1:['2018-01-01','2018-01-02'],
      readonly:false,
      options1: {
        shortcuts: [
          {
            text: '今天',
            value () {
              return new Date();
            },
            onClick: (picker) => {
              this.$hMessage.info('点击了今天');
            }
          },
          {
            text: '昨天',
            value () {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            },
            onClick: (picker) => {
              this.$hMessage.info('点击了昨天');
            }
          },
          {
            text: '一周前',
            value () {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              return date;
            },
            onClick: (picker) => {
              this.$hMessage.info('点击了一周前');
            }
          }
        ],
      },
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    }
  },
  methods: {
    onChange (value) {
        console.log(value);
    },
    onOpenChange () {
        console.log("触发了on-open-change");
    },
    onOk () {
        console.log("触发了on-ok");
    },
    clear(){
      console.log("触发了on-clear");
    }
  } 
}
</script>