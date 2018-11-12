<template>
  <div :class="classes" v-clickoutside="handleClose" :style="multiplestyle" ref="select" >
    <div
      :class="selectionCls"
      ref="reference"
      :tabindex="tabIndex"
      @keyup="keyup" 
      @keydown="keydown"
      @click="toggleMenu">
      <!-- 多选时输入框内选中值模拟 -->
      <div class="h-tag" v-for="(item, index) in selectedMultiple" :key="index">
        <span class="h-tag-text">{{ item.label }}</span>
        <Icon name="close" @click.native.stop="removeTag(index)"></Icon> 
      </div>
      <!-- 下拉输入框模拟（非远程搜索时渲染）  -->
      <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && (!filterable ||showBottom)">{{ localePlaceholder }}</span>
      <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !multiple">{{ selectedSingle }}</span>
      <!-- 下拉输入框(远程搜索时渲染) -->
      <input
        type="text"
        v-if="filterable && !showBottom && selectedMultiple.length==0"
        v-model="query"
        :disabled="disabled"
        :readonly = "!editable||readonly"
        :class="[prefixCls + '-input']"
        :placeholder="showPlaceholder?localePlaceholder:''"
        @blur="handleBlur"
        @keydown="resetInputState"
        @keydown.delete="handleInputDelete"
        tabindex="-1" 
        ref="input">

      <Icon name="close" :class="[prefixCls + '-arrow']" v-show="showCloseIcon" @click.native.stop="clearSingleSelect"></Icon>
      <Icon name="unfold" :class="[prefixCls + '-arrow']" v-if="!remote" ref="arrowb"></Icon>
    </div>
    <transition :name="transitionName">
      <Drop 
        :class="dropdownCls"
        :dropWidth="dropWidth"
        :multiple="multiple"
        v-show="dropVisible" 
        :placement="fPlacement"
        :data-transfer="transfer" 
        ref="dropdown"
        v-transfer-dom>
        <div :class="content" ref="content" @click="handleclick">
          <!-- 单选时清空按钮 -->
          <!-- <ul v-show="notFoundShow" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul> -->
          <span :class="searchClass" ref='search' v-if="filterable && showBottom">
            <Checkbox v-model="selectHead" size="large" v-if="checkToHead&&multiple"></Checkbox>
            <input
              type="text"
              v-model="query"
              :disabled="disabled"
              :readonly = "!editable||readonly"
              :class="[prefixCls + '-input']"
              :placeholder="localeSearchHolder"
              @blur="handleBlur"
              @keydown="resetInputState"
              @keydown.delete="handleInputDelete"
              tabindex="-1" 
              ref="input">
            <!-- <input type="text" placeholder="请输入..." class="h-input h-input-left">  -->
          </span>
          <div v-if="!isBlock" v-show="(!notFound && !remote) || (remote && !loading && !notFound)" :class="[prefixCls + '-dropdown-list']" :style="listStyle" ref='list' @scroll="handleSelectScroll"><slot></slot>
            <ul v-show="isComputed" :class="[prefixCls + '-not-data']">{{ localeNoMoreText }}</ul>
          </div>
          <div v-if="isBlock" v-show="(!notFound && !remote) || (remote && !loading && !notFound)" :class="[prefixCls + '-dropdown-list']" :style="listStyle">
            <slot></slot>
          </div>
          <ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
        </div>
        <div v-if="isCheckall&&multiple&&!notFoundShow" :class="checkAll">
          <Button size="small" @click="toggleSelect(false)">全不选</Button>
          <Button type ="primary" size="small" @click="toggleSelect(true)">全选</Button>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
  import Icon from '../Icon/Icon.vue';
  import Button from '../Button/Button.vue';
  import Drop from '../Select/Dropdown.vue';
  import clickoutside from '../../directives/clickoutside';
  import TransferDom from '../../directives/transfer-dom';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import { on, off } from '../../util/dom';
  import { oneOf, findComponentChildren, getScrollBarSize, getStyle,getBarBottom,scrollAnimate} from '../../util/tools';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';
  const prefixCls = 'h-selectTable';
  export default {
    name: 'SelectTable',
    mixins: [ Emitter, Locale ],
    components: { Icon, Drop ,Checkbox},
    directives: { clickoutside,TransferDom},
    props: {
      disabled:{
        type:Boolean,
        default:false
      },
      readonly:{
        type:Boolean,
        default:false
      },
      editable:{
        type:Boolean,
        default: true
      },
      value: {
        type: [String, Number, Array],
        default: ''
      },
      // 使用时，也得设置 value 才行
      label: {
        type: [String, Number, Array],
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String
      },
      filterable: {
        type: Boolean,
        default: false
      },
      matchable:{
        type:Boolean,
        default:false,
      },
      filterMethod: {
        type: Function
      },
      remote: {
        type: Boolean,
        default: false
      },
      remoteMethod: {
        type: Function
      },
      loading: {
          type: Boolean,
          default: false
      },
      loadingText: {
          type: String
      },
      size: {
          validator (value) {
              return oneOf(value, ['small', 'large', 'default']);
          }
      },
      labelInValue: {
          type: Boolean,
          default: false
      },
      notFoundText: {
          type: String
      },
      placement: {
        validator (value) {
        return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
        },
        default: 'bottom'
      },
      width: {
         type: [String, Number]
      },
      transfer: {
        type: Boolean,
        default: false
      },
      autoComplete: {
        type: Boolean,
        default: false
      },
      isString:{//多选时支持string类型，选项并以','隔开
        type: Boolean,
        default: false
      },
      isCheckall:{//多选 是否显示全选
        type:Boolean,
        default:false
      },
      noMoreText: {//下拉加载完成数据提示
        type: String
      },
      isComputed:{//是否显示加载完成数据提示
        type:Boolean,
        default:false
      },
      dropWidth:{//下拉框的宽度
        type:[String,Number],
      },
      format:{
        type:[Array,String],
        default:function () {
          return ['name,age','_']
        }
      },
      matchWay:{
        validator (value) {
          return oneOf(value, ['left','blurry','all']);
        },
        default: 'blurry'
      },
      matchCol:{
        type:[String,Array,Number,],
        default:''
      },
      searchHolder:{
        type:String,
      },
      showBottom:{
        type:Boolean,
        default:false,
      },
      showBorder:{
        type:Boolean,
        default:false,
      },
      checkToHead:{
        type:Boolean,
        default:false,
      }
    },
    data () {
      return {
        prefixCls: prefixCls,
        visible: false,
        options: [],
        optionInstances: [],
        selectedSingle: '',  
        selectedMultiple: [],
        focusIndex: 0,
        query: '',
        lastQuery: '',
        selectToChangeQuery: false,
        inputLength: 56,
        notFound: false,
        slotChangeDuration: false,
        model: null,
        currentLabel: this.label,
        isInputFocus: false, //是否焦点，为false时触发blur校验
        isLi:true,
        scrollBarWidth: getScrollBarSize(),
        highlightRow:false,
        tabIndex:0,
        selectHead:false,
        fPlacement:this.placement,
        isBlock:false,
        allClick:false,
      };
    },
    computed: {
      searchClass(){
        return [ 
          `${prefixCls}-search`,
          {
            [`${prefixCls}-checkHead`]:this.checkToHead&&this.showBottom&&this.filterable
          }        
        ]
      },
      listStyle(){
        let style = {};
        if (this.showBorder) {
          style.paddingTop=this.showBottom?'52px':'0';
        }else{
          style.paddingTop=this.showBottom?'38px':'0';
        }
        return style;
      },
      classes () {
        return [
          `${prefixCls}`,
          {
              [`${prefixCls}-visible`]: this.visible,
              [`${prefixCls}-disabled`]: this.disabled,
              [`${prefixCls}-readonly`]: this.readonly,
              [`${prefixCls}-editable`]: !this.editable,
              [`${prefixCls}-multiple`]: this.multiple,
              [`${prefixCls}-single`]: !this.multiple,
              [`${prefixCls}-show-clear`]: this.showCloseIcon,
              [`${prefixCls}-${this.size}`]: !!this.size
          }
        ];
      },
      dropdownCls () {
        return {
          [prefixCls + '-dropdown-transfer']: this.transfer,
          [prefixCls + '-multiple']: this.multiple && this.transfer,
          ['h-auto-complete']: this.autoComplete,
        };
      },
      content(){
        return {
          [`${prefixCls}-dropdown-content`]:this.showBorder,
           [`${prefixCls}-dropdown-noline-content`]:!this.showBorder,
        }
      },
      selectionCls () {
        return {
          [`${prefixCls}-selection`]: !this.autoComplete
        };
      },
      showPlaceholder () {
          let status = false;
          if ((typeof this.model) === 'string') {
              if (this.model === '') {
                  status = true;
              }
          } else if (Array.isArray(this.model)) {
              if (!this.model.length) {
                  status = true;
              }
          } else if( this.model === null){
              status = true;
          }

          return status;
      },
      showCloseIcon () {
          return !this.multiple && this.clearable && !this.showPlaceholder && !this.readonly && !this.disabled;
      },
      inputStyle () {
          let style = {};
          if (this.multiple) {
              if (this.showPlaceholder) {
                  style.width = '100%';
              } else {
                  style.width = `${this.inputLength}px`;
              }
          }
          return style;
      },
      localePlaceholder () {
          if (this.placeholder === undefined) {
              return this.t('i.select.placeholder');
          } else {
              return this.placeholder;
          }
      },
      localeSearchHolder () {
          if (this.searchHolder === undefined) {
              return this.t('i.select.searchHolder');
          } else {
              return this.searchHolder;
          }
      },
      localeNotFoundText () {
          if (this.notFoundText === undefined) {
              return this.t('i.select.noMatch');
          } else {
            return this.notFoundText;
          }
      },
      localeLoadingText () {
          if (this.loadingText === undefined) {
              return this.t('i.select.loading');
          } else {
              return this.loadingText;
          }
      },
      localeNoMoreText () {
          if (this.noMoreText === undefined) {
              return this.t('i.select.noMoreData');
          } else {
              return this.noMoreText;
          }
      },
      transitionName () {
        const bottomPlaced = this.fPlacement.match(/^bottom/);
        return bottomPlaced ? 'slide-up' : 'slide-down';
          // return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
      },
      dropVisible () {
        let status = true;         
        const options = this.$slots.default || [];
        if (!this.loading && this.remote && this.query === '' && !options.length) status = false;
        return this.visible && status;
      },    
      multiplestyle () {
        return {
            width: `${this.width}px`,
        };
      },
      checkAll(){
        return `${prefixCls}-checkall`
      },
      notFoundShow () {
          let options = this.options;
          options = options || [];
          let state= (this.notFound) || (!this.loading && !options.length)||(!options.length);
          return state;
      }, 
    },
    methods: {
      handleclick(e){
        e.stopPropagation();
      },
      keyup(event){
        if (this.disabled || this.readonly||!this.editable) {
          return false;
        }
        if (event.keyCode == 9) {
          this.toggleMenu();
        }
      },
      keydown(event){
        if (event.keyCode == 9) {
          this.hideMenu();
        }
      },
      handleSelectScroll(event){
        let num = getBarBottom(event.target,this.scrollBarWidth);
        this.$emit('on-scroll',num)
      },
      toggleSelect(val){        
        if(this.isBlock){
          this.allClick = true;
          let hybridValue=[];
          let curValue = [];
          this.findChild((child) => {
            this.options.forEach((col,i)=>{
              this.$set(child.cloneData[i],'selected',val);
              if(val){
                hybridValue.push({
                  value:col.value,
                  label:col.label
                })
                curValue.push(col.value);                   
              }            
            });
          });
          this.model = curValue;
          this.selectedMultiple = hybridValue.slice(0,50);
          setTimeout(()=>{
            this.selectedMultiple = hybridValue;
          },500)
          if (this.labelInValue) {
            this.$emit('on-change', hybridValue);
            this.dispatch('FormItem', 'on-form-change', hybridValue);
          } else {
            this.$emit('on-change', curValue);
            this.dispatch('FormItem', 'on-form-change',curValue);
          }
        }else{
          if (val) {
            let arr=[];
            this.options.forEach((item)=>{
              arr.push(item.value);
            })
            this.model = arr;
          }else{
            this.model=[];
          }
        }
      },
      offsetArrow(){
        if (!this.multiple) return;
        let el = this.$refs.reference;
        if (el.scrollHeight>el.clientHeight) {
          if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="22px";
        }else{
          if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="8px";
        }
      },
      toggleMenu () {
          if (this.disabled||!this.editable|| this.readonly) {
              return false;
          }
          this.visible = !this.visible;
          this.isInputFocus = true
      },
      hideMenu () {
          this.visible = false;
          this.broadcast('TabelOption', 'on-select-close');
      },
      findChild (cb) {
          const find = function (child) {
              const name = child.$options.componentName;
              if (name) {
                  cb(child);
              } else if (child.$children.length) {
                  child.$children.forEach((innerChild) => {
                      find(innerChild, cb);
                  });
              }
          };

          if (this.optionInstances.length) {
              this.optionInstances.forEach((child) => {
                  find(child);
              });
          } else {
              this.$children.forEach((child) => {
                  find(child);
              });
          }
      },
      updateOptions (init, slot = false) {
        let _this = this;
        let options = [];
        let index = 1;
        this.findChild((child) => {
          let data=[];
          if(_this.isBlock){
            data = child.data;
            data.forEach((col,i)=>{
              options.push({
                value:col.value,
                label:col.label||col.value,
                index:i
              })
            })
          }else{
            data =  child.rebuildData;
            data.forEach((col,i)=>{
              options.push({
                value: _this.getFormatValue(col),
                label: _this.getFormatValue(col),
                index: i
              });
            })
            if (init) {
                this.optionInstances.push(child);
            }
          }
        });
        this.options = options;

        if (init) {
            if (!this.remote) {
                this.updateSingleSelected(true, slot);
                this.updateMultipleSelected(true, slot);
            }
        }
      },
      updateSingleSelected (init = false, slot = false) {
          const type = typeof this.model;
          if (type === 'string' || type === 'number') {
              let findModel = false;
              for (let i = 0; i < this.options.length; i++) {
                  if (this.model === this.options[i].value) {                  
                      this.selectedSingle = this.options[i].label;
                      findModel = true;
                      break;
                  }
              }
              if (slot && !findModel) {
                  this.model = '';
                  this.query = '';
              }
          }

          this.toggleSingleSelected(this.model, init);
      },
      clearSingleSelect () {
        if(this.readonly || this.disabled) return;
        if (this.showCloseIcon) {
          if(this.isBlock){
            this.toggleSingleSelected('')
          }else{
            this.findChild((child) => {
                child.$refs.table.clearAllRow();
            });
          }
          this.model = '';

          if (this.filterable) {
              this.query = '';
          }
          this.hideMenu();
        }
      },
      updateMultipleSelected (init = false, slot = false) {
        if (this.multiple && Array.isArray(this.model)) {
            let selected = this.remote ? this.selectedMultiple : [];

            for (let i = 0; i < this.model.length; i++) {
                const model = this.model[i];

                for (let j = 0; j < this.options.length; j++) {
                    const option = this.options[j];

                    if (model === option.value) {
                        selected.push({
                            value: option.value,
                            label: option.label
                        });
                    }
                }
            }

            const selectedArray = [];
            const selectedObject = {};
            selected.forEach(item => {
                if (!selectedObject[item.value]) {
                    selectedArray.push(item);
                    selectedObject[item.value] = 1;
                }
            });
            this.selectedMultiple = this.remote ? selectedArray : selected;

            if (slot) {
                let selectedModel = [];

                for (let i = 0; i < selected.length; i++) {
                    selectedModel.push(selected[i].value);
                }

                if (this.model.length === selectedModel.length) {
                    this.slotChangeDuration = true;
                }

                this.model = selectedModel;
            }
        }
        this.toggleMultipleSelected(this.model, init);
      },
      removeTag (index) {
        if (this.disabled|| !this.editable|| this.readonly) {
          return false;
        }

        if (this.remote) {
            const tag = this.model[index];
            this.selectedMultiple = this.selectedMultiple.filter(item => item.value !== tag);
        }

        this.model.splice(index, 1);

        if (this.filterable && this.visible&&this.showBottom) {
            this.$refs.input.focus();
        }

        this.broadcast('Drop', 'on-update-popper');
      },

      toggleSingleSelected (value, init = false) {
        let _this=this;
        if (!this.multiple) {
          let label = value;
          if(this.isBlock){
            this.findChild((child)=>{
              this.options.forEach((col,i)=>{
                if(value==col.value){
                  this.$set(child.cloneData[i],'selected',true);
                }else{
                  this.$set(child.cloneData[i],'selected',false);
                }
              })
            })
          }else{
            this.findChild((child) => {
              this.options.forEach(col=>{
                let index = value.indexOf(col.value);
                if (index >= 0) {
                  child.$refs.table.clearSelect(col.index,true);
                  child.$refs.table.clearSingle(col.index,true);
                } else {
                  child.$refs.table.clearSelect(col.index,false);
                  child.$refs.table.clearSingle(col.index,false);
                }
              });
            });
          }
          if (!init) {
            if (this.labelInValue) {
                this.$emit('on-change', {
                    value: value,
                    label: label
                });
                this.dispatch('FormItem', 'on-form-change', {
                    value: value,
                    label: label
                });
            } else {
                this.$emit('on-change', value);
                this.dispatch('FormItem', 'on-form-change', value);
            }
          }
        }
      },
      toggleMultipleSelected (value, init = false) {
        let _this=this;
        if (this.multiple) {
          let hybridValue = [];
          for (let i = 0; i < value.length; i++) {
            hybridValue.push({
              value: value[i]
            });
          }

          this.findChild((child) => {
            if(this.isBlock){
              this.options.forEach((col,i)=>{
                let index = value.indexOf(col.value);
                if(index>-1){
                  this.$set(child.cloneData[i],'selected',true);
                  hybridValue[index].label = col.label;
                }else{
                  this.$set(child.cloneData[i],'selected',false);
                }
              })
            }else{
              _this.options.forEach(col=>{
                let index = value.indexOf(col.value);
                if (index >= 0) {
                  child.$refs.table.clearSelect(col.index,true);
                  hybridValue[index].label = col.label;
                } else {
                  child.$refs.table.clearSelect(col.index,false);
                }
              })
            }
          });
          if (!init) {
            if (this.labelInValue) {
              this.$emit('on-change', hybridValue);
              this.dispatch('FormItem', 'on-form-change', hybridValue);
            } else {
              this.$emit('on-change', value);
              this.dispatch('FormItem', 'on-form-change', value);
            }
          }
        }
      },
      handleClose () {
          this.hideMenu();
          if (this.isInputFocus) {
            if (this.multiple) {
            // 多选返回数组
            this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)          
            } else {
            // 单选返回字符串
            this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
            }
            this.isInputFocus = false
          }
      },
      handleKeydown (e) {
        if (this.visible) {
            const keyCode = e.keyCode;
            // Esc slide-up
            if (keyCode === 27) {
                e.preventDefault();
                this.hideMenu();
            }
            // next
            if (keyCode === 40) {
                e.preventDefault();
                this.navigateOptions('next');
            }
            // prev
            if (keyCode === 38) {
                e.preventDefault();
                this.navigateOptions('prev')
            }
            // enter
            if (keyCode === 13) {
              e.preventDefault();

              this.findChild((child) => {
                if (this.focusIndex-1<0) return false;
                if (!this.multiple){
                  child.$refs.table.enterSingle(this.focusIndex-1,true);
                }else{
                  child.$refs.table.enterSelect(this.focusIndex-1,true);
                }
              });
            }
        }
      },
      navigateOptions (direction) {
        let curTop = this.$refs.list.scrollTop;
        if (this.focusIndex-1>=0) {
          this.findChild((child) => {
            child.$refs.table.changeHover(this.focusIndex-1,false);
          });
        }

        if (direction === 'next') {
            const next = this.focusIndex + 1;
            this.focusIndex = (this.focusIndex === this.options.length) ? 1 : next;
        } else if (direction === 'prev') {
            const prev = this.focusIndex - 1;
            this.focusIndex = (this.focusIndex <= 1) ? this.options.length : prev;
        }
        let top = this.$refs.list.children[0].querySelectorAll('.h-table-row')[this.focusIndex-1].offsetTop;
        this.findChild((child) => {
          child.$refs.table.changeHover(this.focusIndex-1,true);
        });
        // this.$refs.list.scrollTop = top;
        scrollAnimate(this.$refs.list,curTop,top);
      },
      resetScrollTop () {
        const index = this.focusIndex - 1;
        let bottomOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().bottom - this.$refs.dropdown.$el.getBoundingClientRect().bottom;
        let topOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().top - this.$refs.dropdown.$el.getBoundingClientRect().top;

        if (bottomOverflowDistance > 0) {
            this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
            this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
        }
      },
      handleBlur () {
      },
      resetInputState () {
        this.inputLength = this.$refs.input.value.length * 12 + 56;
      },
      handleInputDelete () {
        if (this.multiple && this.model.length && this.query === '') {
          this.removeTag(this.model.length - 1);
        }
      },
      // use when slot changed
      slotChange () {
        this.options = [];
        this.optionInstances = [];
      },
      setQuery (query) {
        if (!this.filterable) return;
        this.query = query;
      },
      modelToQuery() {
        if (!this.multiple && this.filterable && this.model !== undefined) {
          this.findChild((child) => {
              if (this.model === child.value) {
                  if (child.label) {
                      this.query = child.label;
                  } else if (child.searchLabel) {
                      this.query = child.searchLabel;
                  } else {
                      this.query = child.value;
                  }
              }
          });
        }
      },
      broadcastQuery (val) {
        if(this.isBlock){
          this.broadcast('Block', 'on-query-change', val);
        }else{
          this.broadcast('TabelOption', 'on-query-change', val);
        }
      },
      // 处理 remote 初始值
      updateLabel () {
        if (this.remote) {
          if (!this.multiple && this.model !== '') {
            this.selectToChangeQuery = true;
            if (this.currentLabel === '') this.currentLabel = this.model;
            this.lastQuery = this.currentLabel;
            this.query = this.currentLabel;
          } else if (this.multiple && this.model.length) {
            if (this.currentLabel.length !== this.model.length) this.currentLabel = this.model;
            this.selectedMultiple = this.model.map((item, index) => {
              return {
                value: item,
                label: this.currentLabel[index]
              };
            });
          }
        }
      },
      strtoArr(val){
        if (this.multiple && this.isString) {
          if (val==''||val==' '||val == null||val == undefined) {
            return [];
          }else if(val.length>0&&val.indexOf(',')==-1){
            return new Array(val);
          }else{
            return val.split(',');
          }
        }else{
          return val;
        }
      },
      arrtoStr(val){
        if (this.multiple && this.isString) {
          if (val.length == 0) {
            return '';
          }else{
            return val.join(',');
          } 
        }else{
          return val;
        }
      },
      getFormatValue(value){
        let val=''
        let keyArr = this.format[0].split(',');
        let split = this.format[1];
        keyArr.forEach(col=>{
          val+=value[col]+split
        });
        return val.slice(0,val.length-1);
      },
      searchStyle(){
        if (this.filterable && this.showBottom) {
          if(this.isBlock){
            this.$refs.search.style.width ='100%';
          }else{
            let width =this.dropWidth>0?this.dropWidth:parseInt(getStyle(this.$el, 'width'));
            width = width-getScrollBarSize()+'px';
            this.$refs.search.style.width = width;
          }
        }
        // let style = {}
        // style.width="600psx";
        // return style;
      },
      focus(){
        if (this.disabled || this.readonly) return;
        this.$nextTick(()=>{
          this.visible = true;
          if (this.filterable) {
            this.$refs.input.focus();
          }else{
            this.$refs.reference.focus();
          }
        })
      },
      blur(){
        this.visible = false;
        if (this.filterable) {
          this.$refs.input.blur();
        }else{
          this.$refs.reference.blur();
        }
      },
      selectBlockSingle(value){
        if (this.model === value) {
          this.hideMenu();
        }else{
          this.model = value;
          if (this.filterable) {
            this.findChild((child) => {
              if (child.value === value) {
                if (this.query !== '') this.selectToChangeQuery = true;
                this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
              }
            });
          }
        }
      },
      selectBlockMultiple(value){
        const index = this.model.indexOf(value);
        if (index >= 0) {
          this.removeTag(index);
        } else {
          this.model.push(value);
          this.broadcast('Drop', 'on-update-popper');
        }
      }
    },
    mounted () {
      console.log(this.block)
      this.isBlock = this.block?true:false;
      this.modelToQuery();
      // 处理 remote 初始值
      this.updateLabel();
      this.$nextTick(() => {
          this.broadcastQuery('');
      });
      this.updateOptions(true);
      this.$on('append', () => {
        this.slotChange();
        this.updateOptions(true, true);
      });
      this.$on('remove', () => {
        // this.findChild(child => {
        //   child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
        // });

          this.slotChange();
          this.updateOptions(true, true);
      });
      on(document, 'keydown', this.handleKeydown);
      // document.addEventListener('keydown', this.handleKeydown);
      this.$on('on-select-selected', (value,status) => {
        value = this.isBlock?value:this.getFormatValue(value);
        if (this.model === value) {
          this.hideMenu();
        } else {
          if (this.multiple && !status) {
            const index = this.model.indexOf(value);
            if (index >= 0) {
              this.removeTag(index);
            } else {
              this.model.push(value);
              this.broadcast('Drop', 'on-update-popper');
            }
            if (this.filterable) {
              // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
              // if (this.query !== '') this.selectToChangeQuery = true;
              // this.query = '';
              // this.$refs.input.focus();
            }
          } else if(this.multiple && status=="highlight"){
            const index = this.model.indexOf(value);
            if (index >= 0 && this.model.length==1) {
              this.removeTag(index);
            }else{
              let curArr = [];
              curArr.push(value);
              this.model= curArr;
            }
            // if (this.filterable) {
              // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
              // if (this.query !== '') this.selectToChangeQuery = true;
              // this.query = '';
              // this.$refs.input.focus();
            // }
          } else {
            this.model = value;

            if (this.filterable) {
              this.findChild((child) => {
                if (child.value === value) {
                  if (this.query !== '') this.selectToChangeQuery = true;
                  this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
                }
              });
            }
          }
        }
      });
      // this.swidth = parseInt(this.$refs.select.getBoundingClientRect().width)||0;

      this.$nextTick(()=>{
        this.offsetArrow();
        this.searchStyle();
      })
      if (this.disabled) {
        this.tabIndex = -1;
      }
    },
    beforeDestroy () {
      off(document, 'keydown', this.handleKeydown);
      // document.removeEventListener('keydown', this.handleKeydown);
      this.broadcast('Drop', 'on-destroy-popper');
    },
    watch: {
      value:{
        immediate: true,
        handler(val) {
          if (this.multiple && this.isString) {
            this.model = this.strtoArr(val);
          }else{
            this.model = val;
          }
          if (val === '') this.query = '';
        }
      },
      label (val) {
          this.currentLabel = val;
          this.updateLabel();
      },
      model () {
        let backModel = this.arrtoStr(this.model);
        this.$emit('input', backModel);
        this.modelToQuery();
        if (this.multiple) {
          if (this.slotChangeDuration || this.allClick) {
            this.allClick = false;
            this.slotChangeDuration = false;
          } else {
            this.updateMultipleSelected();
          }
        } else {
          this.updateSingleSelected();
        }
      },
      visible (val) {
        if (val) {
          this.$nextTick(()=>{
            let content = this.$refs.content;
            if (content.scrollHeight>content.clientHeight) {
              let cur = this.dropWidth>0?this.dropWidth:parseInt(getStyle(this.$el, 'width'));
              this.findChild(child=>{
                child.hasWidth = cur-this.scrollBarWidth;
              })
            }
          })
          this.broadcast('Drop', 'on-update-popper');
        } else {
          if (this.filterable) {
            setTimeout(() => {
              this.query='';
              this.broadcastQuery('');
            }, 300);
          }
          // this.broadcast('Drop', 'on-destroy-popper');
        }
      },
      query (val) {
        if (this.remote && this.remoteMethod) {
            if (!this.selectToChangeQuery) {
                this.$emit('on-query-change', val);
                this.remoteMethod(val);
            }
            this.focusIndex = 0;
            this.findChild(child => {
                child.isFocus = false;
            });
        } else {
            if (!this.selectToChangeQuery) {
                this.$emit('on-query-change', val);
            }
            this.broadcastQuery(val);
            if(!this.isBlock){
              if (this.filterable&&val) {
                this.$nextTick(()=>{
                  this.findChild(child => {
                    if (this.focusIndex>0)child.$refs.table.changeHover(this.focusIndex-1,false);
                    this.focusIndex = 1;
                    child.$refs.table.changeHover(this.focusIndex-1,true);
                  });
                });
              }
            }
        }
        this.selectToChangeQuery = false;
        // this.broadcast('Drop', 'on-update-popper');
      },
      selectedSingle(){
        this.hideMenu();
      },
      options(val) {
      },
      selectedMultiple(val){
        if (val.length==0&&this.filterable && !this.showBottom) {
          this.$nextTick(()=>{
            this.$refs.input.focus();
          });
        }
        this.$nextTick(()=>{
          this.offsetArrow();
        })
      },
      selectHead(val){
        this.toggleSelect(val);        
      },
      placement(val){
        this.fPlacement = val;
      }
    }
  };
</script>
