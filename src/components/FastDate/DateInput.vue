<template>
  <input
  ref="inputEl"
  v-model="inputValue"
  :class="classes" 
  :readonly="readonly"
  :disabled="disabled"
  @input="val"
  @blur="blur" 
  @focus="focuser"
  @keydown="changeValue"
   />
</template>
<script>
export default {
  name: 'DateInput',
  props: {
    value: {
      type: [String,Number]
    },
    type:{
      type:String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return{
      currentValue: this.value,
      inputValue: '',
      curYear:(new Date()).getFullYear(),
    }
  },
  computed:{
    classes(){
    }
  },
  methods: {
    val(event){
      let value = event.target.value.trim();
      let pos = value.length
      if (/^\d+$/.test(value)||!value) {
        this.currentValue = value;
      } else {
        event.target.value = this.currentValue;
        value = this.currentValue;
      }
      if (this.type == 'year') {
        if (pos==4) {
          this.$emit('on-change-focus');
          // value = value.substr(-1);
          // event.target.value = value    
        }
      }
      if (this.type == 'months' || this.type == 'day') {
        if(pos==2){
          this.$emit('on-change-focus');
        }
        // if (pos>2 || Number(value)>12 || value =='00') { 
        //   value = value.substr(-1);
        //   event.target.value = value
        // }
      }
      if (this.type == 'day') {
        if (pos>2 ||Number(value)>31||value =='00') {
          value = value.substr(-1)
          event.target.value = value
        }
      }
      this.inputValue = value;
      this.$emit('input', this.inputValue);
    },
    blur(event){
      this.$emit('blur', event);
    },
    focuser(event){
      this.$emit('focus', event);
    },
    focus(){
      this.$refs.inputEl.focus();
    },
    changeValue(event){
      if(this.readonly) return;
      let code = event.keyCode
      let curValue;
      if (code == 38){
        curValue = Number(this.inputValue)+1;
        switch(this.type){
          case 'year':
            if (!this.inputValue) curValue = this.curYear;
            this.inputValue = curValue<1?this.curYear:curValue;
            break;
          case 'months':
            this.inputValue = curValue>12?1:curValue;
            break;
          case 'day':
            this.inputValue = curValue>31?1:curValue;
            break;
        }
      }
      if(code == 40){
        curValue = Number(this.inputValue)-1;
        switch(this.type){
          case 'year':
            if (!this.inputValue) curValue = this.curYear;
            this.inputValue = curValue;
            break;
          case 'months':
            this.inputValue = curValue<1?12:curValue;
            break;
          case 'day':
            this.inputValue = curValue<1?31:curValue;
            break;
        }
      }
      this.$emit('input', this.inputValue);
    }
  },
  watch:{
    value(val){
      this.inputValue = val;
    }
  },
  mounted(){
    this.inputValue = this.value;
  },
};
</script>
