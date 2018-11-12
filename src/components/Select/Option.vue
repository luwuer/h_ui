<template>
  <li :class="classes" @click.stop="select" @mouseout.stop="blur" v-show="!hidden">
    <checkbox v-show="multiple&&!hideMult" v-model="selected" @click.native.stop="handleclick" :disabled="disabled" @on-change="checkChange"></checkbox>
    <slot>{{showLabel}}</slot>
  </li>
</template>
<script>
  import Emitter from '../../mixins/emitter';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import {hasClass} from '../../util/tools';
  const prefixCls = 'h-select-item';

  export default {
    name: 'Option',
    componentName: 'select-item',
    mixins: [ Emitter ],
    components:{Checkbox},
    props: {
      value: {
        type: [String, Number],
        required: true
      },
      label: {
        type: [String, Number]
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selected: false,
        index: 0,
        isFocus: false,
        hidden: false,
        searchLabel: '',
        multiple:false,
        hideMult:false,
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-selected`]: this.selected,
            [`${prefixCls}-focus`]: this.isFocus,
          }
        ];
      },
      showLabel () {
        return (this.label) ? this.label : this.value;
      }
    },
    methods: {
      select () {
        if (this.disabled) {
          return false;
        }
        this.dispatch('Select', 'on-select-selected', this.value);
      },
      checkChange(val){
        this.dispatch('Select', 'on-select-selected', this.value);
      },
      blur () {
        this.isFocus = false;
      },
      queryChange (val) {
        const parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.hidden = !new RegExp(parsedQuery, 'i').test(this.searchLabel);
      },
      handleclick(){ 
      }
    },
    mounted () {
      var str=this.$el.innerText
      this.searchLabel = str.replace('false','').replace('true','').trim();
      // this.searchLabel =str.slice(Number(str.indexOf('</label>')+9));
      this.dispatch('Select', 'append');
      this.$on('on-select-close', () => {
        this.isFocus = false;
      });
      this.$on('on-query-change', (val) => {
        this.queryChange(val);
      });
      let obj = this.$parent.$parent;
      if (!hasClass(obj.$el,'h-select')) {
        obj = this.$parent.$parent.$parent;
      }
      this.multiple=obj.multiple;
      this.hideMult=obj.hideMult;
    },
    destroyed () {
      this.dispatch('Select', 'remove');
    }
  };
</script>
