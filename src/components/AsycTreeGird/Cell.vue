<template>
  <!-- :tabindex="row._rowKey+column._columnKey" -->
  <div :class="classes" ref="cell" v-clickoutside="handleClose">
    <div :style="renderSty" @dblclick="dblclickCurrentCell($event, row)" class="dbClass" :class="cellClass">
      <template v-if="showSlot"><slot></slot></template>
      <template v-if="renderType === 'index'">
        <!-- <span v-if="typeName!='treeGird'">{{naturalIndex + 1}}</span> -->
        <!-- <span v-else>{{Number(row._index)+1}}</span> -->
        <span>{{Number(index)+1}}</span>
      </template>
      <template v-if="renderType === 'selection'">
        <Checkbox :value="checked" @click.native.stop="handleClick" @on-change="toggleSelect" :disabled="disabled"></Checkbox>
      </template>
      <template v-if="renderType === 'normal'">
         <span v-html="normalDate"></span> 
        <!-- <span v-html="row[column.key]"></span> -->
      </template>
      <template v-if="renderType === 'text'">
        <Input v-model="columnText" :placeholder="column.placeholder" :icon="column.icon" class="canEdit" @on-change="editinputChange" @on-blur="editinputBlur"></Input>
      </template>
      <template v-if="renderType === 'textArea'">
        <Input v-model="columnArea" type="textarea" :placeholder="column.placeholder" :rows="column.rows" class="canEdit" @on-change="editAreaChange" @on-blur="editAreaBlur"></Input>
      </template>
      <template v-if="renderType === 'number'"> 
        <Input v-model="columnNumber" class="canEdit"></Input>
      </template>
      <template v-if="renderType === 'money'">
        <Typefield 
          v-model="columnMoney" 
          :placeholder="column.placeholder"
          :integerNum="column.integerNum || '10'" 
          :suffixNum="column.suffixNum ||'3' " 
          :bigTips="column.bigTips || false" 
          :isround="column.isround || false" 
          class="canEdit"></Typefield>
      </template>
      <template v-if="renderType === 'card'">
        <Typefield v-model="columnCard" type="cardNo" class="canEdit"></Typefield>
      </template>
      <template v-if="renderType === 'select'">
        <Select v-model="columnSelect"  
          :placeholder="column.placeholder"
          :not-found-text ="column.notFoundText"
          :multiple="column.multiple||false" 
          :filterable="column.filterable||false"
          :filterMethod="filterMethod()"
          :remote="column.remote"
          :remoteMethod="remoteMethod()"
          :loading ="column.loading"
          :transfer ="column.transfer"
          @on-change = "editselectChange"
          class="canEdit">
          <Option v-for="(item,i) in option" :key="i" :value="item.value" :label="item.label">{{item.label}}</Option>
        </Select>
      </template>
      <template v-if="renderType === 'date'">
        <Date v-model="columnDate" 
        :type="column.dateType||'date'" 
        :format="column.format||'yyyy-MM-dd'" 
        :placeholder="column.placeholder"
        :editable ="column.editable"
        :showFormat = "true"
        class="canEdit"></Date>
      </template>
      <template v-if="renderType === 'time'">
        <Time v-model="columnTime" 
        :type="column.timeType||'time'" 
        :format="column.format||'yyyy-MM-dd'" 
        :placeholder="column.placeholder"
        :editable ="column.editable"
        :steps="column.steps||[]" 
        class="canEdit"></Time>
      </template>
      <template v-if="renderType === 'selectTree'">
        <SelectTree v-model="columnTree"
          :firstValue = "firstTreeValue"
          :data="baseData" 
          :placeholder="column.placeholder"
          :showCheckbox="column.showCheckbox" 
          :checkStrictly="column.checkStrictly" 
          :clearable="true"  
          :filterable="true"
          :transfer ="column.transfer"
          class="canEdit">        
        </SelectTree>
      </template>
      <template v-if="renderType === 'expand' && !row._disableExpand">
        <div :class="expandCls" @click="toggleExpand($event)">
          <Icon name="enter"></Icon>
        </div>
      </template>
    </div>
    <Cell
      v-if="render&&renderType != 'expand'"
      :row="row"
      :column="column"
      :index="index"
      :render="column.render"></Cell>
    <transition name="fade">
      <div class="verify-tip verify-bottom" v-if="validateState === 'error'" ref="verifyTip">
        <div class="verify-tip-arrow"></div>
        <div class="verify-tip-inner">{{validateMessage}}</div>
      </div>
    </transition>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import Cell from './expand';
import Icon from '../Icon/Icon.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
import Input from '../Input/Input.vue'
import InputNumber from '../InputNumber/InputNumber.vue'
import Typefield from '../Typefield/Typefield.vue'
import Select from '../Select'
import SelectTree from '../SelectTree/SelectTree.vue'
import Date from '../DatePicker'
import Time from '../TimePicker'
import clickoutside from '../../directives/clickoutside';
import {addClass,removeClass,findComponentsUpward,deepCopy,getYMD,getHMS,typeOf} from '../../util/tools.js'
const Option = Select.Option;
const OptionGroup = Select.OptionGroup;

export default {
  name: 'GirdCell',
  directives: { clickoutside },
  components: { Icon, Checkbox, Cell, Input, InputNumber, Typefield, Select, Option, OptionGroup, SelectTree, Date,Time},
  props: {
    prefixCls: String,
    row: Object,
    column: Object,
    parent:Object,
    naturalIndex: Number,    // index of rebuildData
    columnIndex:Number,
    index: Number,           // _index of data
    checked: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    showEditInput: Boolean,
    // typeName:String,
    option:Array,
    treeOption:Array,
  },
  data () {
    return {
      renderType: '',
      normalDate: this.row[this.column.key],
      columnText: this.row[this.column.key],
      columnArea: this.row[this.column.key],
      columnNumber: this.row[this.column.key],
      columnMoney: this.row[this.column.key],
      columnCard: this.row[this.column.key],
      columnDate: this.row[this.column.key],
      columnTime: this.row[this.column.key],
      columnSelect: this.row[this.column.key],
      columnTree: '',
      firstTreeValue:this.row[this.column.key],
      uid: -1,
      context: this.parent.currentContext,
      showSlot:true,
      validateState:'',
      validateMessage:'',
      rule:null,
      baseData:[],
      render:false,
    };
  },
  computed: {
    renderSty(){
      let style={}
      let typeWidth = this.column.typeWidth;
      if (typeWidth) {
        style.width = this.render?typeWidth+'px':'100%';
      }else{
        style.width = this.render?'70':'100%';
      }
      return style;
    },
    classes () {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false,
          [`${this.prefixCls}-cell-error`]: this.validateState === 'error',
          [`${this.prefixCls}-cell-with-expand`]: this.renderType === 'expand',
          [`${this.prefixCls}-cell-with-render`]: this.render&&this.renderType != 'expand',
        }
      ];
    },
    cellClass (){
      return{
        [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false,
      }
    },
    expandCls () {
      return [
        `${this.prefixCls}-cell-expand`,
        {
          [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
        }
      ];
    },
  },
  methods: {
    handleClose(){
      if (this.showEditInput || this.validateState=='error') return;
      if (this.column.type==='index'|| this.column.type==='selection'|| this.column.type==='expand') {
        this.renderType = this.column.type;
      }else{
        this.renderType = 'normal';
      }
      this.showSlot = true;
    },
    toggleSelect () {
      this.parent.toggleSelect(this.index);
    },
    toggleExpand (e) {
      this.parent.toggleExpand(this.index,e);
    },
    handleClick () {
        // 放置 Checkbox 冒泡
    },
    addBg(){
      if (this.checked) {
        addClass(this.$parent,`${this.prefixCls}-row-hover`)
      }else{
        removeClass(this.$parent,`${this.prefixCls}-row-hover`)
      }
    },
    save(str){ 
      this.$nextTick(()=>{
        // if (!_parent.cloneData || _parent.cloneData.length==0) return;
        var _parent = this.parent;
        switch(str){
          case 'text':
            this.normalDate = this.columnText;
            // _parent.cloneData[this.index][this.column.key] = this.columnText;
            _parent.rebuildData[this.index][this.column.key] = this.columnText;
            break;
          case 'textArea':
            this.normalDate = this.columnArea;
            _parent.rebuildData[this.index][this.column.key] = this.columnArea;
            break;
          case 'number':
            this.normalDate = this.columnNumber;
            _parent.rebuildData[this.index][this.column.key] = this.columnNumber;
            break;
          case 'money':
            this.normalDate = this.columnMoney;
            _parent.rebuildData[this.index][this.column.key] = this.columnMoney;
            break;
          case 'card':
            this.normalDate = this.columnCard;
            _parent.rebuildData[this.index][this.column.key] = this.columnCard;
            break;
          case 'select':
            this.normalDate = this.columnSelect;
            _parent.rebuildData[this.index][this.column.key] = this.columnSelect;
            break;
          case 'date':
            this.normalDate = this.columnDate;
            _parent.rebuildData[this.index][this.column.key] = this.columnDate;
            break; 
          case 'time':
            this.normalDate =this.columnTime;
            _parent.rebuildData[this.index][this.column.key] = this.columnTime;
            break;
          case 'selectTree':
            this.normalDate = this.columnTree;
            _parent.rebuildData[this.index][this.column.key] = this.columnTree;
            break;    
        }
        if (this.rule) {
          this.validate('blur');
        }
      })
    },
    dblclickCurrentCell(e, row){
      e.stopPropagation(); 
      this.showSlot = false;
      if (this.showEditInput) return;
      if (!this.column.type ||this.column.type === 'html') {
        return;
      }else {
        this.renderType = this.column.type;
        this.$nextTick(()=>{
          var inputEl = this.$refs.cell.querySelector('input') || this.$refs.cell.querySelector('textarea');
          if (!inputEl) return;
          inputEl.focus();
        });
      }
    },
    getFilteredRule (trigger) {
      const rules = [];
      rules.push(this.rule);
      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
    },
    validate(trigger, callback = function () {}) {
      const rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
          callback();
          return true;
      }
      this.validateState = 'validating';
      let descriptor = {};
      descriptor['name'] = rules;
      const validator = new AsyncValidator(descriptor);
      let model = {};
      model['name'] = this.normalDate;
      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        callback(this.validateMessage);
      });
    },
    filterMethod(){
      if (this.column.filterMethod) {
        return this.column.filterMethod;
      }
    },
    remoteMethod(){
      if (this.column.remoteMethod){
        return this.column.remoteMethod;
      };
    },
    editselectChange(val){
      this.$emit('on-editselect-change',val,this.columnIndex,this.index);
    },
    editinputChange(){
      this.$emit('on-editinput-change',this.columnText,this.columnIndex,this.index);
    },
    editinputBlur(){
      this.$emit('on-editinput-blur',this.columnText,this.columnIndex,this.index);
    },
    editAreaChange(){
      this.$emit('on-editarea-change',this.columnArea,this.columnIndex,this.index);
    },
    editAreaBlur(){
      this.$emit('on-editarea-blur',this.columnArea,this.columnIndex,this.index);
    }
  },
  watch: {
    columnTree(val){
      this.$emit('on-selecttree-change',val)
      this.save('selectTree');
    },
    columnTime(){
      this.save('time')
    },
    columnDate(){
      this.save('date')
    },
    columnSelect(){
      this.save('select')
    },
    columnCard(){
      this.save('card')
    },
    columnMoney(){
      this.save('money');
    },
    columnNumber(){
      this.save('number');
    },
    columnArea(val){
      this.save('textArea')
    },
    columnText(){
      this.save('text')
    },
    validateState(val){
      if (val=="error") {
        this.$nextTick(()=>{
          if (this.$refs.verifyTip) {
            let fyTip = this.$refs.verifyTip
            let canEdit = fyTip.parentNode.querySelectorAll('.canEdit')[0];
            let left = canEdit.offsetLeft - this.parent.$el.querySelector('.h-editgird-body').scrollLeft;
            let top =canEdit.offsetTop+canEdit.getBoundingClientRect().height -this.parent.$el.querySelector('.h-editgird-body').scrollTop;
            fyTip.style.left = left+'px';
            fyTip.style.top = top+'px';
          }
        })
      }
    },
    treeOption(val){
      this.baseData = deepCopy(val);
    },
    row (row) {
      this.normalDate = row[this.column.key]
      // if(row._index == 6) debugger
      switch(this.column.type){
        case 'text':
          this.columnText = row[this.column.key]
          break;
        case 'textArea':
          this.columnArea = row[this.column.key]
          break;
        case 'number':
          this.columnNumber = row[this.column.key];
          break;
        case 'money':
          this.columnMoney = row[this.column.key];
          break;
        case 'card':
          this.columnCard = row[this.column.key]
          break;
        case 'select':
          this.columnSelect = row[this.column.key]
          break;
        case 'date':
          this.columnDate = row[this.column.key]
          break; 
        case 'time':
          this.columnTime = row[this.column.key]
          break;
        case 'selectTree':
          this.firstTreeValue = row[this.column.key]
          break;    
      }
      // this.$nextTick(() => {    
      //   switch(this.renderType){
      //     case 'text':
      //       this.columnText = val[this.column.key]
      //       break;
      //     case 'textArea':
      //       this.columnArea = val[this.column.key]
      //       break;
      //     case 'number':
      //       this.columnNumber = val[this.column.key];
      //       break;
      //     case 'money':
      //       this.columnMoney = val[this.column.key];
      //       break;
      //     case 'card':
      //       this.columnCard = val[this.column.key]
      //       break;
      //     case 'select':
      //       this.columnSelect = val[this.column.key]
      //       break;
      //     case 'date':
      //       this.columnDate = val[this.column.key]
      //       break; 
      //     case 'time':
      //       this.columnTime = val[this.column.key]
      //       break;
      //     case 'selectTree':
      //       this.firstTreeValue = val[this.column.key]
      //       break;    
      //     }
      // })
    }
  },
  created () {
    if (!this.column.type ||this.column.type === 'html') {
      this.renderType = 'normal';
    } else {
      if (!this.showEditInput&&this.column.type!='index'&&this.column.type!='selection'&&this.column.type!='expand') {
        this.renderType = 'normal';
      }else{
        this.renderType = this.column.type;
      }
    }
    if (this.column.type === 'selectTree') {
      this.baseData = deepCopy(this.treeOption);
    }
    this.render = this.column.render?true:false;
  },
  mounted(){
    this.rule = this.column.rule;
  },
};
</script>
