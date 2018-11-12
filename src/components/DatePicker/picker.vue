<template>
  <div :class="[prefixCls]" v-clickoutside="handleClose" ref='wrapper'>
    <div ref="reference" :class="[prefixCls + '-rel']">
      <slot>
        <h-input
          ref="input"
          :key="forceInputRerender"
          :element-id="elementId"
          :class="[prefixCls + '-editor']"
          :readonly="readonly"
          :editable="editable"
          :disabled="disabled"
          :size="size"
          :placeholder="localePlaceholder"
          :value="visualValue"
          :name="name"
          @on-input-change="handleInputChange"
          @on-focus="handleFocus"
          @on-blur="handleBlur"
          @on-click="handleIconClick"
          @mouseenter.native="handleInputMouseenter"
          @mouseleave.native="handleInputMouseleave"
          :icon="iconType"></h-input>
      </slot>
    </div>
    <transition :name="transition">
      <Drop
          @click.native="handleTransferClick"
          v-show="opened"
          :class="{ [prefixCls + '-transfer']: transfer }"
          :placement="fPlacement"
          ref="drop"
          :data-transfer="transfer"
          v-transfer-dom>
          <div @click="handleclick">
            <component
               :is="panel"
               ref="pickerPanel"
               :visible="visible"
               :showTime="type === 'datetime' || type === 'datetimerange'"
               :confirm="isConfirm"
               :selectionMode="selectionMode"
               :steps="steps"
               :format="format"
               :value="internalValue"
               :start-date="startDate"
               :split-panels="splitPanels"
               :show-week-numbers="showWeekNumbers"
               :picker-type="type"
               :showTwoPanel="this.showTwoPanel"
               :range-num="controlRange?selectRange:0"

               v-bind="ownPickerProps"

               @on-pick="onPick"
               @on-pick-clear="handleClear"
               @on-pick-success="onPickSuccess"
               @on-pick-click="disableClickOutSide = true"
               @on-selection-mode-change="onSelectionModeChange"
               @on-select-range="handleSelectRange"
            ></component>
       </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
  import hInput from '../../components/Input/Input.vue';
  import Drop from '../../components/Select/Dropdown.vue';
  import clickoutside from '../../directives/clickoutside';
  import TransferDom from '../../directives/transfer-dom';
  import { oneOf,indexOf} from '../../util/tools';
  import { on, off } from '../../util/dom';
  import {DEFAULT_FORMATS, TYPE_VALUE_RESOLVER_MAP } from './util';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';

  const prefixCls = 'h-date-picker';
  const isEmptyArray = val => val.reduce((isEmpty, str) => isEmpty && !str || (typeof str === 'string' && str.trim() === ''), true);

  export default {
    name: 'CalendarPicker',
    mixins: [ Emitter,Locale ],
    components: { hInput, Drop },
    directives: { clickoutside, TransferDom },
    props: {
      format: {
          type: String
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
          default: true
      },
      clearable: {
          type: Boolean,
          default: true
      },
      confirm: {
          type: Boolean,
          default: false
      },
      open: {
          type: Boolean,
          default: null,
      },
      multiple: {
          type: Boolean,
          default: false
      },
      showWeekNumbers: {
          type: Boolean,
          default: false
      },
      startDate: {
          type: [Date,String]
      },
      size: {
          validator (value) {
              return oneOf(value, ['small', 'large']);
          }
      },
      placeholder: {
          type: String,
      },
      placement: {
          validator (value) {
              return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
          },
          default: 'bottom-start'
      },
      options: {
          type: Object
      },
      transfer: {
          type: Boolean,
          default: false
      },
      name: {
          type: String
      },
      elementId: {
          type: String
      },
      steps: {
          type: Array,
          default: () => []
      },
      value: {
          type: [Date, String, Array]
      },
      showFormat:{
        type:Boolean,
        default:false,
      },
      controlRange:{
        type:Boolean,
        default:false,
      },
      selectRange:{//可选择范围 多系统交易
        type:[String,Number],
        default:1
      },
      showTwoPanel:{
        type:Boolean,
        default:false,
      },
      autoPlacement:{
        type:Boolean,
        default:false,
      }
    },
    data () {
      const isRange = this.type.indexOf('range')>-1?true:false;
      const emptyArray = isRange ? [null, null] : [null];
      let initialValue = isEmptyArray((isRange ? this.value : [this.value]) || []) ? emptyArray : this.parseDate(this.value);
      if (this.name=='splicePanel') initialValue=this.parseDate(this.value);
      return {
        prefixCls: prefixCls,
        showClose: false,
        visible: false,
        internalValue: initialValue,
        disableClickOutSide: false,    // fixed when click a date,trigger clickoutside to close picker
        disableCloseUnderTransfer: false,  // transfer 模式下，点击Drop也会触发关闭
        selectionMode: this.onSelectionModeChange(this.type),
        forceInputRerender: 1,
        isFocus: false,
        rangeNum:0,
        fPlacement:this.placement
      };
    },
    computed: {
      publicVModelValue(){
        if (this.multiple){
            return this.internalValue.slice();
        } else {
            // const isRange = this.type.includes('range');
            const isRange = this.type.indexOf('range')>-1?true:false;
            let val = this.internalValue.map(date => date instanceof Date ? new Date(date) : (date || ''));
            if (this.type.match(/^time/)) val = val.map(this.formatDate);
            return (isRange || this.multiple) ? val : val[0];
        }
      },
      publicStringValue(){
        const {formatDate, publicVModelValue, type} = this;
        if (type.match(/^time/)) return publicVModelValue;
        return Array.isArray(publicVModelValue) ? publicVModelValue.map(formatDate) : formatDate(publicVModelValue);
      },
      opened () {
        return this.open === null ? this.visible : this.open;
      },
      iconType () {
        let icon = 'activity';
        if (this.type === 'time' || this.type === 'timerange') icon = 'time';
        if (this.showClose) icon = 'close';
        return icon;
      },
      transition () {
        const bottomPlaced = this.fPlacement.match(/^bottom/);
        return bottomPlaced ? 'slide-up' : 'slide-down';
      },
      visualValue() {
          return this.formatDate(this.internalValue);
      },
      isConfirm(){
          return this.confirm || this.type === 'datetime' || this.type === 'datetimerange' || this.multiple;
      },
    },
    methods: {
      onSelectionModeChange(type){
          if (type.match(/^date/)) type = 'date';
          this.selectionMode = oneOf(type, ['year', 'month', 'date', 'time']) && type;
          return this.selectionMode;
      },
      // 开启 transfer 时，点击 Drop 即会关闭，这里不让其关闭
      handleTransferClick () {
        if (this.transfer) this.disableCloseUnderTransfer = true;
      },
      handleClose () {
        if (this.disableCloseUnderTransfer) {
          this.disableCloseUnderTransfer = false;
          return false;
        }
        if (this.open !== null) return;
        //if (!this.disableClickOutSide) this.visible = false;
        this.visible = false;
        this.disableClickOutSide = false;
        if (this.isFocus) {
            this.dispatch('FormItem', 'on-form-blur', this.currentValue);
            this.isFocus = false
        }
      },
      handleFocus () {
        if (this.readonly||this.disabled) return;
        this.visible = true;
        this.$refs.pickerPanel.onToggleVisibility(true);
        this.isFocus = true
      },
      focus(){
        if (this.disabled) return false;
        this.$nextTick(()=>{
          this.visible = true;
          this.$refs.pickerPanel.onToggleVisibility(true);
          this.isFocus = true
          if(this.$refs.input) this.$refs.input.focus();
        })
      },
      blur(){
        this.visible = false;
        this.$refs.pickerPanel.onToggleVisibility(false);
        this.isFocus = false
        if(this.$refs.input) this.$refs.input.blur();
      },
      handleBlur () {
        this.visible = false;
        this.onSelectionModeChange(this.type);
        this.internalValue = this.internalValue.slice(); // trigger panel watchers to reset views
        this.reset();
        this.$refs.pickerPanel.onToggleVisibility(false);
      },
      reset(){
          this.$refs.pickerPanel.reset && this.$refs.pickerPanel.reset();
      },
      handleInputChange (event) {
        // if (value==''||String(value).length==0) {
        //   this.handleClear();
        //   return false;
        // }
        // const isArrayValue = this.type.includes('range') || this.multiple;
        const isArrayValue = this.type.indexOf('range')>-1?true:false || this.multiple;
        const oldValue = this.visualValue;
        const newValue = event.target.value;
        const newDate = this.parseDate(newValue);
        const disabledDateFn =
            this.options &&
            typeof this.options.disabledDate === 'function' &&
            this.options.disabledDate;
        const valueToTest = isArrayValue ? newDate : newDate[0];
        const isDisabled = disabledDateFn && disabledDateFn(valueToTest);
        const isValidDate = newDate.reduce((valid, date) => valid && date instanceof Date, true);

        if (newValue !== oldValue && !isDisabled && isValidDate) {
            this.emitChange();
            this.internalValue = newDate;
        } else {
            this.forceInputRerender++;
        }
      },
      handleInputMouseenter () {
        if (this.readonly || this.disabled) return;
        if (this.visualValue && this.clearable) {
          this.showClose = true;
        }
      },
      handleInputMouseleave () {
        this.showClose = false;
      },
      handleIconClick () {
        if (this.showClose) {
          this.handleClear();
        } else if (!this.disabled) {
           this.handleFocus();
        }
      },
      handleClear () {
        this.visible = false;
        this.internalValue = this.internalValue.map(() => null);
        this.$emit('on-clear');
        this.dispatch('FormItem', 'on-form-change', '');
        this.emitChange();
        this.reset();
        setTimeout(
            () => this.onSelectionModeChange(this.type),
            500 // delay to improve dropdown close visual effect
        );
      },
      emitChange () {
          this.$nextTick(() => {
              this.$emit('on-change', this.publicStringValue);
              this.dispatch('FormItem', 'on-form-change', this.publicStringValue);
          });
      },
      parseDate(val) {
          // const isRange = this.type.includes('range');
          const isRange = this.type.indexOf('range')>-1?true:false;
          const type = this.type;
          const parser = (
              TYPE_VALUE_RESOLVER_MAP[type] ||
              TYPE_VALUE_RESOLVER_MAP['default']
          ).parser;
          const format = this.format || DEFAULT_FORMATS[type];
          const multipleParser = TYPE_VALUE_RESOLVER_MAP['multiple'].parser;

          if (val && type === 'time' && !(val instanceof Date)) {
              val = parser(val, format);
          } else if (this.multiple && val) {
              val = multipleParser(val, format);
          } else if (isRange) {
              if (!val){
                  val = [null, null];
              } else {
                  if (typeof val === 'string') {
                      val = parser(val, format);
                  } else if (type === 'timerange') {
                      val = parser(val, format);
                  } else {
                      val = val.map(date => new Date(date)); // try to parse
                      val = val.map(date => isNaN(date.getTime()) ? null : date); // check if parse passed
                  }
              }
          } else if (typeof val === 'string' && type.indexOf('time') !== 0){
              val = parser(val, format) || null;
          }

          return (isRange || this.multiple) ? (val || []) : [val];
      },
      formatDate(value){
          const format = DEFAULT_FORMATS[this.type];

          if (this.multiple) {
              const formatter = TYPE_VALUE_RESOLVER_MAP.multiple.formatter;
              return formatter(value, this.format || format);
          } else {
              const {formatter} = (
                  TYPE_VALUE_RESOLVER_MAP[this.type] ||
                  TYPE_VALUE_RESOLVER_MAP['default']
              );
              return formatter(value, this.format || format);
          }
      },
      onPick(dates, visible = false) {
          if (this.multiple){
              const pickedTimeStamp = dates.getTime();
              const indexOfPickedDate = this.internalValue.findIndex(date => date && date.getTime() === pickedTimeStamp);
              const allDates = [...this.internalValue, dates].filter(Boolean);
              const timeStamps = allDates.map(date => date.getTime()).filter((ts, i, arr) => arr.indexOf(ts) === i && i !== indexOfPickedDate); // filter away duplicates
              this.internalValue = timeStamps.map(ts => new Date(ts));
          } else {
              this.internalValue = Array.isArray(dates) ? dates : [dates];
          }
          if (!this.isConfirm) this.onSelectionModeChange(this.type); // reset the selectionMode
          if (!this.isConfirm) this.visible = visible;
          this.emitChange();
      },
      onPickSuccess(){
          this.visible = false;
          this.$emit('on-ok');
          this.reset();
      },
      handleSelectRange(val,status){
        this.$emit('on-select-range',val,status);
      },
      handleclick(e){
        e.stopPropagation();
      },
      setPlacement(){
        //   debugger;
        if(this.autoPlacement){
            let obj = this.$refs.wrapper;
            let allWidth= document.body.clientWidth;
            let allHeight= document.body.clientHeight;
            let curbottom =allHeight-obj.offsetTop-obj.clientHeight;
            let curright = allWidth-obj.offsetLeft;
            let bottomNum = this.confirm?300:250;
            let rightNum = this.type.indexOf('range')>-1?436:220;
            let isShortcuts =  this.options&&this.options.shortcuts&&this.options.shortcuts.length>0;
            rightNum =isShortcuts?rightNum+95:rightNum;
            if(curbottom<bottomNum&&curright<rightNum){
                this.fPlacement = 'top-end';
            }else if(curbottom<bottomNum){
                this.fPlacement = 'top-start';
            }else if(curright<rightNum){
                this.fPlacement = 'bottom-end';
            }
        }
      }
    },
    watch: {
      visible (state) {
        if (state === false){
        //   this.$refs.drop.destroy();
          const input = this.$el.querySelector('input');
          if (input) input.blur();
        }
        this.$refs.drop.update();
        this.$emit('on-open-change', state);
      },
      value(val) {
        this.internalValue = this.parseDate(val);
      },
      open (val) {
        this.visible = val === true;
      },
      type(type){
          this.onSelectionModeChange(type);
      },
      publicVModelValue(now, before){
        const newValue = JSON.stringify(now);
        const oldValue = JSON.stringify(before);
        const shouldEmitInput = newValue !== oldValue || typeof now !== typeof before;
        const strValue = this.showFormat==true?this.visualValue:now;
        if (shouldEmitInput){
          this.$emit('input', strValue); // to update v-model
          // this.$emit('input', now); // to update v-model
        } 
      },
      placement(val){
          this.fPlacement = val;
      },
    },
    beforeDestroy () {
      if (this.picker) {
        this.picker.$destroy();
      }
      this.$refs.drop.destroy();
    },
    mounted () {
      const initialValue = this.value;
      const parsedValue = this.publicVModelValue;
      if (typeof initialValue !== typeof parsedValue || JSON.stringify(initialValue) !== JSON.stringify(parsedValue)){
          if (this.showFormat) {
            this.$emit('input', this.visualValue); // to update v-model
          }else{
            this.$emit('input', this.publicVModelValue); // to update v-model
          }
      }
      if (this.open !== null) this.visible = this.open;
      this.setPlacement();
    }
  };
</script>
