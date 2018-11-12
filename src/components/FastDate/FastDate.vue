<template>
  <div :class="wrapperClass" v-clickoutside="handleClose">
    <Datepicker
      :value="inputValue"
      :type="type"
      :open="opened"
      :confirm="confirm"
      :readonly="readonly" 
      :disabled="disabled"
      :editable="editable"
      :transfer="transfer"
      :format="format"
      :options="options"
      :placement="fPlacement"
      autoPlacement
      @on-change="handleChange"
      @on-clear="handleClear"
      @on-ok="handleOk">
      <div :class="innerClass" ref="inner">
        <div :class="classSingle" @click="handleSingleClick" @keydown="changeFocus($event,false)" ref="single">
          <span>
            <DateInput ref="year" v-model="year" @on-change-focus="change(1)" type="year" :readonly="readonly" :disabled="disabled"  @focus="rangeSelect" @blur="editBlur($event,'year',false)" :style="yearStyle" :class="yearClass" :placeholder="yearPlaceholder"></DateInput>
          </span>
          <span v-show="year||months||day">{{dateSplit}}</span>
          <span v-show="year||months||day">
            <DateInput v-model="months" @on-change-focus="change(2)" type="months" @focus="rangeSelect" :readonly="readonly" :disabled="disabled" @blur="editBlur($event,'months',false)"></DateInput>
          </span>
          <span v-show="year||months||day">{{dateSplit}}</span>
          <span v-show="year||months||day">
            <DateInput v-model="day" @on-change-focus="change(3)" type="day" @focus="rangeSelect" :readonly="readonly" :disabled="disabled" @blur="editBlur($event,'day',false)"></DateInput>
          </span>
          <span :class="[prefixCls + '-activity left-icon']"><Icon @on-click="arrowClick" name="activity"></Icon></span>
          <span class="left-icon" v-show="clearable" ><Icon @on-click="closeClick" name="close" size="14"></Icon></span>
        </div>
        <div v-show="showRange" :class="[prefixCls+'-inner-split']">--</div>
        <div v-show="showRange" :class="classRange" @click="handleRangeClick" @keydown="changeFocus($event,true)" ref="range">
          <span>
            <DateInput  ref="year1" type="year" @on-change-focus="change(4)" v-model="year1" @focus="rangeSelect" :readonly="readonly" :disabled="disabled" @blur="editBlur($event,'year',true)" :style="yearStyle1" :class="yearClass" :placeholder="yearPlaceholder"></DateInput>
          </span>
          <span v-show="year1||months1||day1">{{dateSplit}}</span>
          <span v-show="year1||months1||day1">
            <DateInput v-model="months1" type="months" @on-change-focus="change(5)" @focus="rangeSelect" :readonly="readonly" :disabled="disabled" @blur="editBlur($event,'months',true)"></DateInput>
          </span>
          <span v-show="year1||months1||day1">{{dateSplit}}</span>
          <span v-show="year1||months1||day1">
            <DateInput v-model="day1" type="day" @focus="rangeSelect" :readonly="readonly" :disabled="disabled" @blur="editBlur($event,'day',true)"></DateInput>
          </span>
          <span :class="[prefixCls + '-activity left-icon']"><Icon @on-click="arrowClick" name="activity"></Icon></span>
          <span class="left-icon" v-show="clearable" ><Icon @on-click="closeClick" name="close" size="14"></Icon></span>
        </div>
      </div>
    </Datepicker>
  </div>
</template>
<script>
import Icon from '../Icon/Icon.vue'
import Datepicker from '../DatePicker';
import hButton from '../Button/Button.vue';
import DateInput from './DateInput.vue';
import { on, off } from '../../util/dom';
import clickoutside from '../../directives/clickoutside';
import {oneOf,getYMD,isdate,getCurrentYear,getCurrentMonth,getCurrentDay,typeOf} from '../../util/tools';
import Locale from '../../mixins/locale';
import Emitter from '../../mixins/emitter';
const prefixCls = 'h-fast-date'
export default {
  name: 'FastDate',
  mixins: [ Locale,Emitter],
  components: {hButton,Icon,Datepicker,DateInput},
  directives: { clickoutside},
  props: {
    type:{
      validator(value) {
        return oneOf(value, ['year', 'month', 'date', 'daterange']);
      },
      default: 'date',
    },
    value: {
      type: [Date, String, Array,Number]
    },
    readonly: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: false,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
    open: {
        type: Boolean,
        default: false,
    },
    transfer: {
        type: Boolean,
        default: false
    },
    setDefault:{
      type:Boolean,
      default:false,
    },
    showFormat:{//显示输入框中显示的格式
      type:Boolean,
      default:false,
    },
    format:{
      type: String,
      default:'yyyyMMdd'
    },
    clearable:{//是否显示清空按钮
      type:Boolean,
      default:false,
    },
    options:{
      type:[Object]
    },
    placement: {
      validator (value) {
        return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
      },
      default: 'bottom-start'
    },
    placeholder: {
      type: String,
      default: '',
    },
    dateSplit:{
      type:String,
      default:'-',
    }
  },
  data(){
    return{
      prefixCls: prefixCls,
      formatSplit:'',
      opened: this.open,
      inputValue:'',
      year:'',
      months:'',
      day:'',
      year1:'',
      months1:'',
      day1:'',
      yearPlaceholder:'',
      fPlacement:this.placement,
    }
  },
  computed: {
    yearStyle(){
      let style={}
      if (!this.year&&!this.months&&!this.day) {
        this.yearPlaceholder = this.placeholder;
        style.width='120px';
      }else{
        this.yearPlaceholder='';
        style.width='32px';
      }
      return style;
    },
    yearStyle1(){
      let style={}
      if (!this.year1&&!this.months1&&!this.day1) {
        this.yearPlaceholder = this.placeholder;
        style.width='120px';
      }else{
        this.yearPlaceholder='';
        style.width='32px';
      }
      return style;
    },
    yearClass(){
      return {
        [`${prefixCls}-algin-left`]:!this.year&&!this.months&&!this.day,
      }
    },
    wrapperClass(){
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-wrapper`]:true
        }
      ]
    },
    innerClass(){
      return [
        `${prefixCls}-inner clearfix`,
        {
          [`${prefixCls}-inner-range`]: this.type == 'daterange',
          [`${prefixCls}-inner-single`]: this.type != 'daterange',
        }
      ];
    },
    classSingle(){
      return [
        `${prefixCls}-edit`,
        {
          [`${prefixCls}-single`]:true,
          [`${prefixCls}-disabled`]:this.disabled,
          [`${prefixCls}-readonly`]:this.readonly,
        }
      ]
    },
    classRange(){
      return [
        `${prefixCls}-edit`,
        {
          [`${prefixCls}-range`]:true,
          [`${prefixCls}-disabled`]:this.disabled,
          [`${prefixCls}-readonly`]:this.readonly,
        }
      ]
    },
    showRange(){
      return this.type == 'daterange';
    }
  },
  methods: {
    editBlur(event,str,isRange){
      let value = event.target.value.trim().replace(/[^0-9]/ig,"");
      if (!value || value.length==0){
        if(isRange){
          if(!this.year1&&!this.months1&&!this.day1) return;
        }else{
          if(!this.year&&!this.months&&!this.day) return;
        }
      }
      switch (str){
        case 'year':
          value = this.verificaYear(value,isRange);
          event.target.value = value;
          if (!isRange) {this.year = value;}
          else {this.year1 = value;}
          break;
        case 'months':
          value = this.verificaMonth(value,isRange);
          event.target.value = value;
          if (!isRange) {this.months = value;}
          else {this.months1 = value;}
          break;
        case 'day':
          value = this.verificaDay(value,isRange);
          event.target.value = value;
          if (!isRange) {this.day = value;}
          else {this.day1 = value;}
          break;
      }
      if (this.type!='daterange') {
        this.inputValue = this.year+this.formatSplit+this.months+this.formatSplit+this.day;
      }else{
        if (this.year.length!=4) {
          this.year = this.year1;
        }
        let item0 = this.year+this.formatSplit+this.months+this.formatSplit+this.day;
        let item1 = this.year1+this.formatSplit+this.months1+this.formatSplit+this.day1
        let Num0 = item0.replace(/[^0-9]/ig,"");
        let Num1 = item1.replace(/[^0-9]/ig,"");
        if (Number(Num1)<Number(Num0)) {
          item1 = item0;
        }
        this.inputValue = [item0,item1];
      }
    },
    verificaYear(val,isrange){
      let pos = val.length;
      let value=null;
      switch (pos){
        case 1:
          value = '200'+val;
          break;
        case 2:
          value = Number(val)>51?'19'+val:'20'+val;
          break;
        case 3:
          if (Number(val)<50) {value = '2'+val;}
          else if (Number(val)>951) {value = '1'+val;}
          else {value = getCurrentYear()}
          break;
        case 4:
          value = Number(val)>1950? val:getCurrentYear();
          break;
        default:
          value = getCurrentYear();
      }
      if (!isrange) {
        this.day = isdate(value,this.months,this.day)? this.day:'01';
      }else{
        this.day1 = isdate(value,this.months1,this.day1)? this.day1:'01';
      }
      return value;
    },
    verificaMonth(val,isrange){
      let pos = val.length;
      let value=null;
      switch (pos){
        case 1:
          value = '0'+val;
          break;
        case 2:
          value = Number(val)>12? '0'+val.substr(-1):val;
          break;
        default:
          value = getCurrentMonth();
      }
      if (Number(value)==0) {
        value=getCurrentMonth();
      }
      if (!isrange) {
        this.day = isdate(this.year,value,this.day)? this.day:'01';
      }else{
        this.day1 = isdate(this.year1,value,this.day1)? this.day1:'01';
      }
      return value;
    },
    verificaDay(val,isrange){
      let pos = val.length;
      let value=null;
      switch (pos){
        case 1:
          value = '0'+val;
          break;
        case 2:  
          if (!isrange) {value = isdate(this.year,this.months,val)? val:'01';} 
          else{value = isdate(this.year1,this.months1,val)? val:'01';}    
          break;
        default:
          value = getCurrentDay();
      }
      if (Number(value)==0) {
        value='01';
      }
      return value;
    },
    yearInput(value,isrange){
      let pos = value.length;
      if (pos!=0 &&!this.months&&!this.day) {
          this.year = this.year1 = value;
          this.months = getCurrentMonth();
          this.day = getCurrentDay();
          this.months1 = getCurrentMonth();
          this.day1 = getCurrentDay();  
      }
    },
    closeClick(){
      if (this.readonly || this.disabled) return;
      this.$emit('on-clear')
      if (this.type!='daterange') {
        this.inputValue='';
      }else{
        this.inputValue=[];
      }
    },
    changeFocus(event,isrange){
      let code = event.keyCode
      let inputList =isrange?this.$refs.range.querySelectorAll('input'):this.$refs.single.querySelectorAll('input');
      let activeInx; 
      let nextInx;
      for (var i = inputList.length - 1; i >= 0; i--) {
        if(inputList[i]== document.activeElement){
          activeInx = i;
        }
      }
      // inputList.forEach((col,i)=>{//ie 11 不支持foreach
      //   if (col == document.activeElement) {
      //     activeInx = i;
      //   }
      // });
      if (code==37) {
        event.preventDefault();
        nextInx = (activeInx-1)>=0?(activeInx-1):2;
      }
      if (code==39) {
        event.preventDefault();
        nextInx = (activeInx+1)>2?0:(activeInx+1);
      }
      if (nextInx || nextInx==0) {
        inputList[nextInx].focus();
      }
    },  
    change(inx){
      let inputList = this.$refs.inner.querySelectorAll('input');
      if(inx==3&&inputList.length<4) return;
      inputList[inx].focus();
    },
    handleChange (date) {
      this.inputValue = date;
      this.$emit('on-change',date);
      if (!this.confirm) this.opened=false;
    },
    handleClear () {
      this.opened = false;
      this.$emit('on-clear')
    },
    handleOk () {
      this.opened = false;
      this.$emit('on-ok')
    },
    handleSingleClick(){
      if (!this.year&&!this.months&&!this.day) {
        this.$refs.year.focus();
      }
    },
    handleRangeClick(){
      if (!this.year1&&!this.months1&&!this.day1) {
        this.$refs.year1.focus();
      }
    },
    handleClose(){
      this.opened = false;
    },
    arrowClick(){
      if(this.readonly || this.disabled)return;
      this.opened = !this.opened;
    },
    rangeSelect(event){
      let obj =  event.target;
      let pos = obj.value.trim().length;
      obj.setSelectionRange(0, pos);
    },
    setDate(val){
      if (!val||val.length == 0){
        this.year = '';
        this.months = '';
        this.day = '';
        this.year1 = '';
        this.months1 = '';
        this.day1 = '';
        return false;
      };
      let arr=[];
      let arr1=[];
      if (this.type != 'daterange') {
        if(!this.formatSplit&&val.length!=8) return;
        arr =this.getArr(val,this.formatSplit)
      }else{
        if(!this.formatSplit&&(val[0].length!=8||val[1].length!=8)) return;
        arr =this.getArr(val[0],this.formatSplit)
        arr1 =this.getArr(val[1],this.formatSplit)
      }
      this.year = arr[0];
      this.months = arr[1];
      this.day = arr[2];
      if (arr1&&arr1.length>0) {
        this.year1 = arr1[0];
        this.months1 = arr1[1];
        this.day1 = arr1[2];
      }
    },
    getArr(str,splits){
      if (splits || splits!='') {
        return str.split(splits);
      }else{
        let arr = []
        arr[0] = str.slice(0,4)
        arr[1] = str.slice(4,6)
        arr[2] = str.slice(6,8)
        return arr;
      }

    },
    getDateSplit(format){
      if (format.indexOf('/')!=-1) {
        return '/';
      }else if (format.indexOf('-')!=-1) {
        return '-';
      }else{
        return '';
      }
    },
    focus(){
      this.opened = true;
      this.$refs.year.focus();
    },
    isClear(){
      if (this.type!='daterange') {
        if (!this.year&&!this.months&&!this.day) {
          this.inputValue = '';
        }else if(!(this.year&&this.months&&this.day)){
          this.inputValue = this.year+this.formatSplit+this.months+this.formatSplit+this.day;
        }
      }else{
        if (!this.year&&!this.months&&!this.day&&!this.year1&&!this.months1&&!this.day1) {
          this.inputValue = ['',''];
        }else if(!(this.year&&this.months&&this.day&&this.year1&&this.months1&&this.day1)){
          let item0 = this.year+this.formatSplit+this.months+this.formatSplit+this.day;
          let item1 = this.year1+this.formatSplit+this.months1+this.formatSplit+this.day1
          this.inputValue = [item0,item1];
        }
      }
    }
  },
  watch:{
    opened(val){
      this.$emit('on-open-change',val);
    },
    year(val){
      this.yearInput(val)
      this.isClear();
    },
    year1(val){
      this.yearInput(val,true)
      this.isClear();
    },
    months(){
      // this.isClear();
    },
    months1(){
      // this.isClear();
    },
    day(){
      // this.isClear();
    },
    day1(){
      // this.isClear();
    },
    inputValue(val){
      this.setDate(val);
      this.$emit('input',val);
      this.dispatch('FormItem', 'on-form-change',val);
    },
    value(val){
      if (typeOf(val)!='array') {
        this.inputValue = String(val);
        // this.setDate(String(this.value));
      }else{
        this.inputValue = val;
        // this.setDate(this.value);
      }
    },
    placement(val){
      this.fPlacement = val;
    }
  },
  mounted(){
    if (this.format) {
      this.formatSplit=this.getDateSplit(this.format);
    }
    if (this.value && String(this.value).length>0) {
      this.inputValue = typeOf(this.value)=='array'?this.value:String(this.value);
      // this.setDate(this.value);
    }else if(this.setDefault){
      if (this.type!='daterange') {
        this.inputValue = getYMD(new Date(),this.formatSplit,0);
      }else{
        this.inputValue = [getYMD(new Date(),this.formatSplit,0),getYMD(new Date(),this.formatSplit,0)];
      }
    }
  },
};
</script>
