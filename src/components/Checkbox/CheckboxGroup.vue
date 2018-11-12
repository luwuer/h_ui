<template>
  <div :class="classes">
      <slot></slot>
  </div>
</template>
<script>
  import { findComponentsDownward, oneOf,indexOf} from '../../util/tools';
  import Emitter from '../../mixins/emitter';
  const prefixCls = 'h-checkbox-group';

  export default {
    name: 'CheckboxGroup',
    mixins: [ Emitter ],
    props: {
        value: {
            type: Array,
            default () {
                return [];
            }
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
            curValue:this.value,
            childrens: [],
            childrensBtn: [],
        };
    },
    computed: {
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`h-checkbox-${this.size}`]: !!this.size
                }
            ];
        }
    },
    mounted () {
        this.updateModel(true);
    },
    methods: {
        updateModel (update) {
            const value = this.value;
            this.childrens = findComponentsDownward(this, 'Checkbox');
            this.childrensBtn = findComponentsDownward(this, 'Checkbtn');

            if (this.childrens) {
                this.childrens.forEach(child => {
                    child.model = value;

                    if (update) {
                        child.currentValue = value.indexOf(child.label) >= 0;
                        child.group = true;
                    }
                });
            }
            if(this.childrensBtn){
                this.childrensBtn.forEach(child => {
                    child.isChecked = value.indexOf(child.value) >= 0;
                });
            }
        },
        change (data) {
            this.currentValue = data;
            this.$emit('input', data);
            this.$emit('on-change', data);
            this.dispatch('FormItem', 'on-form-change', data);
        },
        changeBtn(value,status){
            if(status){
                this.curValue.push(value);
            }else{
                let index = this.curValue.indexOf(value);
                if(index!=-1){
                   this.curValue.splice(index,1); 
                }
            }
            this.$emit('input', this.curValue);
            this.$emit('on-change', this.curValue);
            this.dispatch('FormItem', 'on-form-change', this.curValue);
        }
    },
    watch: {
        value () {
            this.updateModel(true);
            this.curValue = this.value;
        }
    }
  };
</script>
