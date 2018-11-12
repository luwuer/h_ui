<template>
  <div :class="wrapClasses">
    <template v-if="type !== 'textarea'">
      <div :class="[prefixCls + '-group-prepend']" v-if="prepend" v-show="slotReady"><slot name="prepend"></slot></div>
      <Icon :name="icon" :class="[prefixCls + '-icon',prefixCls + '-icon-normal']" v-if="icon&&type!='textarea'" @on-click="handleIconClick"></Icon>
      <transition name="fade">
        <Icon name="load-c" class="h-icon h-load-loop" :class="[prefixCls + '-icon', prefixCls + '-icon-validate']" v-if="!icon"></Icon>
      </transition>
      <input
        ref="input"
        :type="type"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :readonly="!editable || readonly"
        :name="name"
        :value="currentValue"
        :number="number"
        :autofocus="autofocus"
        :spellcheck="spellcheck"
        @keyup.enter="handleEnter"
        @keyup="handleKeyup"
        @keypress="handleKeypress"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange">
      <div :class="[prefixCls + '-group-append']" v-if="append" v-show="slotReady"><slot name="append"></slot></div>
    </template>
    <textarea
      v-else
      ref="textarea"
      :class="textareaClasses"
      :style="textareaStyles"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :readonly="readonly"
      :name="name"
      :value="currentValue"
      :autofocus="autofocus"
      :spellcheck="spellcheck"
      @keyup.enter="handleEnter"
      @keyup="handleKeyup"
      @keypress="handleKeypress"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @change="handleChange">
    </textarea>
    <div v-if="type=='password'&&strengthTip" :class="`${prefixCls}-tips`">
      <ul>
        <li>
          <div :class="weakClass"></div>
          {{this.t('i.input.weak')}}
        </li>
        <li>
          <div :class="generalClass"></div>
          {{this.t('i.input.general')}}
        </li>
        <li>
          <div :class="complexClass"></div>
          {{this.t('i.input.complex')}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { oneOf, findComponentsUpward } from '../../util/tools';
  import calcTextareaHeight from '../../util/calcTextareaHeight';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';
  import Icon from '../Icon/Icon.vue'

  const prefixCls = 'h-input';

  export default {
    name: 'Input',
    mixins: [ Emitter,Locale ],
    components:{Icon},
    props: {
      type: {
        validator (value) {
          return oneOf(value, ['text', 'textarea', 'password']);
        },
        default: 'text'
      },
      value: {
        type: [String, Number],
        default: ''
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large','normal']);
        }
      },
      placeholder: {
        type: String,
        default: ''
      },
      maxlength: {
        type: Number
      },
      disabled: {
        type: Boolean,
        default: false
      },
      icon: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      readonly: {
        type: Boolean,
        default: false
      },
      editable: {
        type: Boolean,
        default: true
      },
      name: {
        type: String
      },
      number: {
        type: Boolean,
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      },
      algin:{//金额组件内部显示
        type:String,
        default:'left',
      },
      strengthTip:{
        type:Boolean,
        default:false
      },
      tipState:{
        type:String,
        default:null,
      },
      spellcheck:{
        type:Boolean,
        default:false,
      },
      canResize:{
        type:Boolean,
        default:true
      }
    },
    data () {
      return {
        currentValue: this.value,
        prefixCls: prefixCls,
        prepend: true,
        append: true,
        slotReady: false,
        textareaStyles: {},
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrapper`,
          {
            [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
            [`${prefixCls}-type`]: this.type!='textarea',
            [`${prefixCls}-group`]: this.prepend || this.append,
            [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append) && !!this.size,
            [`${prefixCls}-group-with-prepend`]: this.prepend,
            [`${prefixCls}-group-with-append`]: this.append,
            [`${prefixCls}-hide-icon`]: this.append  // #554
          }
        ];
      },
      inputClasses () {
        return [
          `${prefixCls}`,
          `${prefixCls}-${this.algin}`,
          {
            [`${prefixCls}-${this.size}`]: !!this.size,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-readonly`]: this.readonly,
            [`${prefixCls}-editable`]: !this.editable
          }
        ];
      },
      textareaClasses () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-noresize`]:!this.canResize,  
          }
        ];
      },
      weakClass(){
        return{
          [`${prefixCls}-tips-weak`]:this.tipState=='weak'||this.tipState=='general'||this.tipState=='complex',
        }
      },
      generalClass(){
        return{
          [`${prefixCls}-tips-general`]:this.tipState=='general'||this.tipState=='complex',
        }
      },
      complexClass(){
        return{
          [`${prefixCls}-tips-complex`]:this.tipState=='complex',
        }
      }
    },
    methods: {
      handleEnter (event) {
        this.$emit('on-enter', event);
      },
      handleKeydown (event) {
        this.$emit('on-keydown', event);
      },
      handleKeypress(event) {
        this.$emit('on-keypress', event);
      },
      handleKeyup (event) {
        this.$emit('on-keyup', event);
      },
      handleIconClick (event) {
        this.$emit('on-click', event);
      },
      handleFocus (event) {
        this.$emit('on-focus', event);
      },
      handleBlur (event) {
        this.$emit('on-blur', event);
        if (!findComponentsUpward(this, ['HDatePicker', 'DatePicker','HTimePicker','TimePicker', 'HCascader','Cascader', 'HSearch','Search'])) {
          this.dispatch('FormItem', 'on-form-blur', this.currentValue);
        }
      },
      handleInput (event) {
        let value = event.target.value;
        if (this.number) value = Number.isNaN(Number(value)) ? value : Number(value);
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('on-change', event);
      },
      handleChange (event) {
        this.$emit('on-input-change', event);
      },
      setCurrentValue (value) {
        if (value === this.currentValue) return;
        this.$nextTick(() => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        if (!findComponentsUpward(this, ['HDatePicker', 'DatePicker','HTimePicker','TimePicker', 'HCascader','Cascader', 'HSearch','Search'])) {
          this.dispatch('FormItem', 'on-form-change', value);
        }
      },
      resizeTextarea () {
        const autosize = this.autosize;
        if (!autosize || this.type !== 'textarea') {
          return false;
        }

        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      focus() {
        if (this.type === 'textarea') {
          this.$refs.textarea.focus();
        } else {
          this.$refs.input.focus();
        }
      },
      blur() {
        if (this.type === 'textarea') {
          this.$refs.textarea.blur();
        } else {
          this.$refs.input.blur();
        }
      }
    },
    watch: {
      value (val) {
        this.setCurrentValue(val);
      }
    },
    mounted () {
      if (this.type !== 'textarea') {
        this.prepend = this.$slots.prepend !== undefined;
        this.append = this.$slots.append !== undefined;
      } else {
        this.prepend = false;
        this.append = false;
      }
      this.slotReady = true;
      this.resizeTextarea();
    }
  };
</script>
