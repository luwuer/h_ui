<template>
  <label :class="wrapClasses">
    <span :class="checkboxClasses">
      <span :class="innerClasses"></span>
      <input
        v-if="group"
        type="checkbox"
        :class="inputClasses"
        :disabled="disabled"
        :value="label"
        v-model="model"
        @change="change"
        @click="click($event)">
      <input
        v-if="!group"
        type="checkbox"
        :class="inputClasses"
        :disabled="disabled"
        :checked="currentValue"
        @change="change"
        @click="click($event)">
    </span>
    <slot><span v-if="showSlot">{{ label }}</span></slot>
  </label>
</template>
<script>
  import { findComponentsUpward, oneOf } from '../../util/tools';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-checkbox';

  export default {
    name: 'Checkbox',
    mixins: [ Emitter ],
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Boolean],
        default: false
      },
      trueValue: {
        type: [String, Number, Boolean],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean],
        default: false
      },
      label: {
        type: [String, Number, Boolean]
      },
      indeterminate: {
        type: Boolean,
        default: false
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large', 'default']);
        }
      }
    },
    data () {
      return {
        model: [],
        currentValue: this.value,
        group: false,
        showSlot: true,
        parent: findComponentsUpward(this, 'CheckboxGroup')
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrapper`,
          {
            [`${prefixCls}-group-item`]: this.group,
            [`${prefixCls}-wrapper-checked`]: this.currentValue,
            [`${prefixCls}-wrapper-disabled`]: this.disabled,
            [`${prefixCls}-${this.size}`]: !!this.size
          }
        ];
      },
      checkboxClasses () {
        return [
          `${prefixCls}`,
          {
              [`${prefixCls}-checked`]: this.currentValue,
              [`${prefixCls}-disabled`]: this.disabled,
              [`${prefixCls}-indeterminate`]: this.indeterminate
          }
        ];
      },
      innerClasses () {
        return `${prefixCls}-inner`;
      },
      inputClasses () {
        return `${prefixCls}-input`;
      }
    },
    mounted () {
      this.parent = findComponentsUpward(this, 'CheckboxGroup');
      if (this.parent) this.group = true;
      if (!this.group) {
          this.updateModel();
          this.showSlot = this.$slots.default !== undefined;
      } else {
          this.parent.updateModel(true);
      }
    },
    methods: {
      change (event) {
          if (this.disabled) {
            return false;
          }

          const checked = event.target.checked;
          this.currentValue = checked;

          let value = checked ? this.trueValue : this.falseValue;
          this.$emit('input', value);
          if (this.group) {
              this.parent.change(this.model);
          } else {
              this.$emit('on-change', value);
              this.dispatch('FormItem', 'on-form-change', value);
          }
      },
      updateModel () {
          this.currentValue = this.value === this.trueValue;
      },
      click(e){
        this.$emit('on-click',e);
      }
    },
    watch: {
      value (val) {
          if (val !== this.trueValue && val !== this.falseValue) {
              throw 'Value should be trueValue or falseValue.';
          }
          this.updateModel();
      }
    }
  };
</script>
