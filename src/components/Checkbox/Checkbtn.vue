<template>
  <span :class="wrapClasses" @click="change">
    <div :class="innerClasses">
    	<slot>{{label}}</slot>
    </div>
    <div v-if="isChecked" :class="[`${prefixCls}-icon`]"><Icon :name="icon"></Icon></div>
  </span>
</template>
<script>
  import { findComponentsUpward, oneOf } from '../../util/tools';
  import Emitter from '../../mixins/emitter';
  import Icon from '../Icon/Icon.vue';

  const prefixCls = 'h-checkbtn';

  export default {
    name: 'Checkbtn',
    mixins: [ Emitter ],
    components:{Icon},
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Boolean],
        default: false
      },
      icon: {
        type: String,
        default: 'right'
      },
      label: {
        type: [String, Number, Boolean]
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large', 'default']);
        }
      }
    },
    data () {
      return {
        prefixCls: prefixCls,
        isChecked:false,
        model:[],
        parent: findComponentsUpward(this, 'CheckboxGroup')
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrapper`,
          {
            [`${prefixCls}-wrapper-selected`]: this.isChecked,
            [`${prefixCls}-wrapper-disabled`]: this.disabled,
            [`${prefixCls}-${this.size}`]: !!this.size
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
      this.parent.updateModel(true);
    },
    methods: {
      change (event) {
          if (this.disabled) {
            return false;
          }
          this.isChecked = !this.isChecked;
          this.parent.changeBtn(this.value,this.isChecked);
          this.$emit('on-click',event,this.isChecked);
      },
    },
    watch: {
    }
  };
</script>
