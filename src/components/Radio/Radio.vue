<template>
  <label :class="wrapClasses" @click="radioClick">
    <span :class="radioClasses">
      <span :class="innerClasses"></span>
      <input
        type="radio"
        :class="inputClasses"
        :disabled="disabled"
        :checked="currentValue"
        @change="change">
    </span><slot>{{ label }}</slot>
  </label>
</template>
<script>
  import { findComponentsUpward, oneOf } from '../../util/tools';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-radio';

  export default {
    name: 'Radio',
    mixins: [ Emitter ],
    props: {
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
        type: [String, Number]
      },
      disabled: {
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
        currentValue: this.value,
        group: false,
        parent: findComponentsUpward(this, 'RadioGroup')
      };
    },
    computed: {
      showBtnIcon () {
        if (this.parent.type == 'button' && !!this.parent.btnIcon && this.parent.btnIconOnlyChecked) {
          return this.currentValue
        } else {
          return !!this.parent.btnIcon && this.parent.type == 'button'
        }
      },
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
      radioClasses () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-btnIcon`]: this.showBtnIcon
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
      if (this.parent) this.group = true;
      if (!this.group) {
          this.updateValue();
      } else {
          this.parent.updateValue();
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

        if (this.group && this.label !== undefined) {
          this.parent.change({
            value: this.label,
            checked: this.value
          });
        }
        if (!this.group) {
          this.$emit('on-change', value);
          this.dispatch('FormItem', 'on-form-change', value);
        }
      },
      radioClick(){
        this.$emit('on-click')
      },
      updateValue () {
        this.currentValue = this.value === this.trueValue;
      }
    },
    watch: {
      value (val) {
        if (val !== this.trueValue && val !== this.falseValue) {
          throw 'Value should be trueValue or falseValue.';
        }
        this.updateValue();
      }
    }
  };
</script>
