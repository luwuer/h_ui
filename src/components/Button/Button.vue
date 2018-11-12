<template>
  <button ref="btn" :type="nativeType" :class="classes" :disabled="disabled" @click="handleClick" @keyup="keyup" :title="title">
  	<Icon name="load-c" v-if="loading" class='h-load-loop'></Icon>
    <Icon :name="icon" v-if="icon && !loading"></Icon>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
import Icon from '../Icon/Icon.vue'
import {oneOf} from '../../util/tools'
const prefixCls = 'h-btn';
export default {
	name:'Button',
	components: { Icon },
	props:{
		type: {
      validator (value) {
	        return oneOf(value, ['primary', 'ghost', 'dashed', 'text', 'danger', 'info', 'success', 'warning', 'error']);
	      }
	    },
		btnWith: {
	    type:Number,
	    default: 0
		},
		btnHeight: {
	    type:Number,
	    default: 0
		},
		btnBgColor: {
			type:String,
			default: ''
		},
		textColor: {
			type:String,
			default: ''
		},
		size: {
	    validator (value) {
	      return oneOf(value, ['small','large']);
	    }
		},
		shape: {
	    validator (value) {
	      return oneOf(value, ['circle', 'circle-outline']);
	    }
		},
		loading: Boolean,
		disabled: Boolean,
		nativeType: {
	    default: 'button',
	    validator (value) {
	      return oneOf(value, ['button', 'submit', 'reset']);
	    }
		},
		icon: String,
		long: {
		    type: Boolean,
		    default: false
		},
		title:String,
		canFocus:{
			type: Boolean,
			default: false
		}
	}, 
	data() {
		return {
			showSlot: true,
		}
	},
	computed: {
    classes () {
      return [
        `${prefixCls}`,
        {
            [`${prefixCls}-${this.type}`]: !!this.type,
            [`${prefixCls}-disable`]: !!this.disabled,
            [`${prefixCls}-long`]: this.long,
            [`${prefixCls}-${this.shape}`]: !!this.shape,
            [`${prefixCls}-${this.size}`]: !!this.size,
            [`${prefixCls}-loading`]: this.loading != null && this.loading,
            [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || this.loading),
            [`${prefixCls}-focus`]: this.canFocus,
        }
      ];
    }
	},
	watch:{
	},
	methods: {
	    handleClick (event) {
	      this.$emit('click', event);
	      this.$emit('on-click', event);
	    },
	    focus(){
	    	if (!this.canFocus) return;
	    	this.$refs.btn.focus();
	    },
	    keyup(event){
	    	if (!this.canFocus) return;
	    	let code = event.keycode;
	    	if (code == 13) {
	    		this.handleClick(event);
	    	}
	    }
	},
	mounted () {
	  this.showSlot = this.$slots.default !== undefined;
	  if (this.btnWith>0) {
	  	this.$refs.btn.style.width =this.btnWith+'px';
	  }
	  if (this.btnHeight>0) {
	  	this.$refs.btn.style.height = this.btnHeight+'px';
	  }
	  if (this.btnBgColor!=''&&this.btnBgColor) {
	  	this.$refs.btn.style.backgroundColor = this.btnBgColor;
	  }
	  if (this.textColor!=''&&this.textColor) {
	  	this.$refs.btn.style.color = this.textColor;
	  }
	}
}
</script>