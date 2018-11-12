<template>
  <div :class="classes" @click="groupClick">
    <slot></slot>
  </div>
</template>
<script>
  import { oneOf, findComponentsDownward } from '../../util/tools';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-radio-group';

  export default {
    name: 'RadioGroup',
    mixins: [ Emitter ],
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      size: {
        validator (value) {
            return oneOf(value, ['small', 'large', 'default']);
        }
      },
      type: {
        validator (value) {
            return oneOf(value, ['button']);
        }
      },
      vertical: {
        type: Boolean,
        default: false
      },
      btnIcon: {
        type: Boolean,
        default: false
      },
      btnIconOnlyChecked: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value,
        childrens: []
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-${this.size}`]: !!this.size,
            [`h-radio-${this.size}`]: !!this.size,
            [`${prefixCls}-${this.type}`]: !!this.type,
            [`${prefixCls}-vertical`]: this.vertical
          }
        ];
      }
    },
    mounted () {
      this.updateValue();
    },
    methods: {
      updateValue () {
        const value = this.value;
        this.childrens = findComponentsDownward(this, 'Radio');

        if (this.childrens) {
          this.childrens.forEach(child => {
            child.currentValue = value == child.label;
            child.group = true;
          });
        }
      },
      change (data) {
        this.currentValue = data.value;
        this.updateValue();
        this.$emit('input', data.value);
        this.$emit('on-change', data.value);
        this.dispatch('FormItem', 'on-form-change', data.value);
      },
      groupClick(){
        this.$emit('on-click');
      }
    },
    watch: {
      value () {
        this.updateValue();
      }
    }
  };
</script>
