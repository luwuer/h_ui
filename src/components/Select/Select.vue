<template>
  <div :class="classes" v-clickoutside="handleClose" :style="multiplestyle" ref="select">
    <div
      :title="titleTip"
      :class="selectionCls"
      ref="reference"
      :tabindex="tabIndex"
      @click="toggleMenu"
      @keyup="keyup"
      @keydown="keydown">
      <!-- 多选时输入框内选中值模拟 -->
      <div class="h-tag" v-for="(item, index) in selectedMultiple" :key="index">
        <span class="h-tag-text">{{ item.label }}</span>
        <Icon name="close" @click.native.stop="removeTag(index)"></Icon>
      </div>
        <!-- 下拉输入框模拟（非远程搜索时渲染）  -->
      <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && (!filterable || showBottom)">{{ localePlaceholder }}</span>
      <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !multiple && !(filterable && !showBottom)">{{ selectedSingle }}</span>
      <!-- 下拉输入框(远程搜索时渲染) -->
      <input
        type="text"
        v-if="filterable && !showBottom"
        v-model="query"
        :disabled="disabled"
        :readonly = "readonly || !editable"
        :class="[prefixCls + '-input']"
        :placeholder="showPlaceholder?localePlaceholder:''"
        :style="inputStyle"
        autocomplete="off"
        @blur="handleBlur"
        @keydown="resetInputState"
        @keydown.delete="handleInputDelete"
        tabindex="-1"
        ref="input">
      <!-- 单选时清空按钮 -->
      <Icon name="close" :class="[prefixCls + '-arrow']" v-if="showCloseIcon" @click.native.stop="clearSingleSelect"></Icon>
      <Icon name="unfold" :class="[prefixCls + '-arrow']" v-if="!remote && isArrow" ref="arrowb"></Icon>
    </div>
    <transition :name="transitionName">
      <Drop
        :class="dropdownCls"
        v-show="dropVisible"
        :dropWidth="dropWidth"
        :placement="fPlacement"
        :data-transfer="transfer"
        ref="dropdown"
        v-transfer-dom>
        <div :class="content" @scroll="handleSelectScroll" ref="content" @click="handleclick">
          <span v-if="filterable && showBottom" :class="checkHeadClass">
            <Checkbox v-model="selectHead" v-if="checkToHead&&multiple"></Checkbox>
            <input
              type="text"
              v-model="query"
              :disabled="disabled"
              :readonly = "!editable||readonly"
              :class="[prefixCls + '-content-input']"
              :placeholder="localeSearchHolder"
              autocomplete="off"
              @blur="handleBlur"
              @keydown="resetInputState"
              @keydown.delete="handleInputDelete"
              tabindex="-1"
              ref="input">
          </span>
          <span v-if="hideMult&&multiple" :class="hideMultHead" @click="toggleSelect(!isSelectAll)">全选</span>
          <ul v-show="notFoundShow" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul>
          <ul v-show="(!notFound && !remote) || (remote && !loading && !notFound)" :class="[prefixCls + '-dropdown-list']"><slot></slot></ul>
          <ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
          <ul v-show="isComputed" :class="[prefixCls + '-not-data']">{{ localeNoMoreText }}</ul>
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
  import Drop from './Dropdown.vue';
  import clickoutside from '../../directives/clickoutside';
  import TransferDom from '../../directives/transfer-dom';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import { on, off } from '../../util/dom';
  import { oneOf, findComponentChildren, getScrollBarSize, getStyle,getBarBottom,scrollAnimate,typeOf} from '../../util/tools';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';
  const prefixCls = 'h-select';
  export default {
    name: 'Select',
    mixins: [ Emitter, Locale ],
    components: { Icon, Drop, Checkbox},
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
      isArrow:{//typefield时有需求不显示箭头
        type:Boolean,
        default:true,
      },
      algin:{
        type:String,
        default:'left',
      },
      setDefSelect:{//如果选择为空
        type:Boolean,
        default:false,
      },
      dropWidth:{//下拉框的宽度
        type:[String,Number],
      },
      searchHolder:{
        type:String,
      },
      showBottom:{
        type:Boolean,
        default:false
      },
      specialIndex:{
        type:Boolean,
        default:false,
      },
      checkToHead:{//只在多选且筛选框下有效
        type:Boolean,
        default:false,
      },
      showTitle:{
        type:Boolean,
        default:false,
      },
      hideMult:{
        type:Boolean,
        default:false,
      },
      focusSelect: {
        type: Boolean,
        default: true,
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
        isfirstSelect: false,
        tabIndex:0,
        selectHead:false,
        titleTip:'',
        fPlacement:this.placement,
        isSelectAll:false,
        typeValue:'string',
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
              [`${prefixCls}-visible`]: this.visible,
              [`${prefixCls}-disabled`]: this.disabled,
              [`${prefixCls}-editable`]: !this.editable,
              [`${prefixCls}-readonly`]: this.readonly,
              [`${prefixCls}-multiple`]: this.multiple,
              [`${prefixCls}-single`]: !this.multiple,
              [`${prefixCls}-show-clear`]: this.showCloseIcon,
              [`${prefixCls}-${this.size}`]: !!this.size,
              [`${prefixCls}-hideMult`]:this.hideMult&&this.multiple
          }
        ];
      },
      checkHeadClass(){
        return {[`${prefixCls}-checkHead`]:this.checkToHead&&this.showBottom&&this.filterable}
      },
      hideMultHead(){
        return {
          [`${prefixCls}-hideMultHead`]:this.hideMult&&this.multiple,
          [`${prefixCls}-hideMultHead-select`]:this.isSelectAll,
        }
      },
      dropdownCls () {
        return {
          [prefixCls + '-dropdown-transfer']: this.transfer,
          [prefixCls + '-multiple']: this.multiple && this.transfer,
          ['h-auto-complete']: this.autoComplete,
        };
      },
      content(){
        return `${prefixCls}-dropdown-content`
      },
      selectionCls () {
        return [
          `${prefixCls}-${this.algin}`,
          {
            [`${prefixCls}-selection`]: !this.autoComplete
          }
        ];
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
          return !this.multiple && this.clearable && !this.showPlaceholder;
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
        let options = this.options||this.$slots.default;
        options = options || [];
        let state= (this.notFound && !this.remote) || (this.remote && !this.loading && !options.length)||(!this.remote&&!options.length);
        return state;

      },
    },
    methods: {
      handleclick(e){
        e.stopPropagation();
      },
      keyup(event){
        if (event.keyCode == 9) {
          if (this.disabled || this.readonly||!this.editable) {
            return false;
          }else{
            this.toggleMenu();
          }
        }
      },
      keydown(event){
        if (event.keyCode == 9) {
          this.hideMenu();
        }
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
      handleSelectScroll(event){
        let num = getBarBottom(event.target,this.scrollBarWidth);
        this.$emit('on-scroll',num)
      },
      toggleSelect(val){
        this.isSelectAll = !this.isSelectAll
        if (val) {
          if (this.specialIndex) {
            this.model=this.typeValue=='string'?['-1']:[-1];
          }else{
            let arr=[];
            this.options.forEach((item)=>{
              arr.push(item.value);
            })
            this.model = arr;
          }
        }else{
          this.model=[];
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
          if (this.disabled || this.readonly||!this.editable) {
              return false;
          }
          this.visible = !this.visible;
          this.isInputFocus = true
      },
      hideMenu () {
          this.visible = false;
          this.focusIndex = 0;
          this.broadcast('Option', 'on-select-close');
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
          let options = [];
          let index = 1;
          this.findChild((child) => {
              options.push({
                value: child.value,
                // label: (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label
                label: (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label
              });
              child.index = index++;
              if (init) {
                  this.optionInstances.push(child);
              }
          });
          this.options = options;
          if(this.specialIndex&&this.options.length>0){
            this.typeValue = typeOf(this.options[0].value);
          }
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
        if (this.readobly || !this.editable) return false;
        if (this.showCloseIcon) {
            this.findChild((child) => {
                child.selected = false;
            });
            this.model = '';

            if (this.filterable && !this.showBottom) {
                this.query = '';
            }
            this.hideMenu();
            this.titleTip='';
        }
      },
      updateMultipleSelected (init = false, slot = false) {
        if (this.multiple && Array.isArray(this.model)) {
            let selected = this.remote && this.model.length > 0 ? this.selectedMultiple : [];

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
        if (this.disabled || this.readonly || !this.editable) {
          return false;
        }
        if (this.remote) {
            const tag = this.model[index];
            this.selectedMultiple = this.selectedMultiple.filter(item => item.value !== tag);
        }

        this.model.splice(index, 1);

        if (this.filterable && this.visible && !this.showBottom) {
            this.$refs.input.focus();
        }

        this.broadcast('Drop', 'on-update-popper');
      },
      toggleSingleSelected (value, init = false) {
        if (!this.multiple) {
          let label = '';
          this.findChild((child) => {
              if (child.value === value) {
                  child.selected = true;
                  // label: (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label
                  label = (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label;
              } else {
                  child.selected = false;
              }
          });
          // this.hideMenu();
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
        if (this.multiple) {
          let curSelect = true;
          let hybridValue = [];
          for (let i = 0; i < value.length; i++) {
              hybridValue.push({
                value: value[i]
              });
          }
          this.findChild((child) => {
              const index = value.indexOf(child.value);
              if (index >= 0) {
                  child.selected = true;
                  hybridValue[index].label  = (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label;
                  // hybridValue[index].label = (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label;
              } else {
                  child.selected = false;
              }
              if(curSelect && child.selected==false){
                curSelect=false;
              }
          });
          this.isSelectAll = curSelect;
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
                this.navigateOptions('prev');
            }
            // enter
            if (keyCode === 13) {
                e.preventDefault();

                this.findChild((child) => {
                    if (child.isFocus) {
                        child.select();
                    }
                });
            }
        }
      },
      navigateOptions (direction) {
        let curTop = this.$refs.content.scrollTop;
          if (direction === 'next') {
              const next = this.focusIndex + 1;
              this.focusIndex = (this.focusIndex === this.options.length) ? 1 : next;
          } else if (direction === 'prev') {
              const prev = this.focusIndex - 1;
              this.focusIndex = (this.focusIndex <= 1) ? this.options.length : prev;
          }

          let child_status = {
              disabled: false,
              hidden: false
          };

          let find_deep = false;

          this.findChild((child) => {
              if (child.index === this.focusIndex) {
                  child_status.disabled = child.disabled;
                  child_status.hidden = child.hidden;

                  if (!child.disabled && !child.hidden) {
                      child.isFocus = true;
                  }
              } else {
                  child.isFocus = false;
              }

              if (!child.hidden && !child.disabled) {
                  find_deep = true;
              }
          });
          let top = 32*(this.focusIndex-1);
          scrollAnimate(this.$refs.content,curTop,top);
          this.resetScrollTop();

          if ((child_status.disabled || child_status.hidden) && find_deep) {
              this.navigateOptions(direction);
          }
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
        this.$emit('on-blur');
        if (this.showBottom) return false;
        setTimeout(() => {
          const model = this.model;

          if (this.multiple) {
              this.query = '';
          } else {
            if (model !== '') {
                this.findChild((child) => {
                    if (child.value === model) {
                        this.query = child.label === undefined ? child.searchLabel : child.label;
                        this.query = this.query.trim();
                    }
                });
                // 如果删除了搜索词，下拉列表也清空了，所以强制调用一次remoteMethod
                // if (this.remote && this.query !== this.lastQuery) {
                //     this.$nextTick(() => {
                //         this.query = this.lastQuery.trim();
                //     });
                // }
            } else {
                this.query = '';
            }
          }
        }, 300);
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
        if (!this.multiple && this.filterable && this.model !== undefined &&!this.showBottom) {
          this.findChild((child) => {
            if (this.model === child.value) {
                if (child.label) {
                    this.query = child.label.trim();
                } else if (child.searchLabel) {
                    this.query = child.searchLabel.trim();
                } else {
                    this.query = child.value.trim();
                }
            }
          });
        }
      },
      broadcastQuery (val) {
          if (findComponentChildren(this, 'OptionGroup')) {
              this.broadcast('OptionGroup', 'on-query-change', val);
              this.broadcast('Option', 'on-query-change', val);
          } else {
              this.broadcast('Option', 'on-query-change', val);
          }
      },
      // 处理 remote 初始值
      updateLabel () {
        if (this.remote) {
          if (!this.multiple && this.model !== '') {
            this.selectToChangeQuery = true;
            if(this.options.length>0){
              this.model=this.value;
            }else{
              if (this.currentLabel === '') this.currentLabel = this.model;
              this.lastQuery = this.currentLabel;
              this.query = this.currentLabel;
            }
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

    },
    mounted () {
      if (!this.multiple && this.setDefSelect && this.value == ''){
        this.isfirstSelect = true;
      }
      this.modelToQuery();
      // 处理 remote 初始值
      this.$nextTick(() => {
          this.broadcastQuery('');
      });

      this.updateOptions(true);
      this.updateLabel();
      on(document,'keydown', this.handleKeydown);

      this.$on('append', () => {
        if (!this.remote) {
          this.modelToQuery();
          this.$nextTick(() => {
              this.broadcastQuery('');
          });
        } else {
          this.findChild(child => {
              child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
          });
        }
        this.slotChange();
        this.updateOptions(true, true);
      });
      this.$on('remove', () => {
          if (!this.remote) {
              this.modelToQuery();
              this.$nextTick(() => {
                  this.broadcastQuery('');
              });
          } else {
              this.findChild(child => {
                  child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
              });
          }
          this.slotChange();
          this.updateOptions(true, true);
      });

      this.$on('on-select-selected', (value) => {
        if (this.model === value) {
          this.hideMenu();
        } else {
          if (this.multiple) {
            const index = this.model.indexOf(value);
            if (index >= 0) {
              this.removeTag(index);
            } else {
              if (this.specialIndex) {
                let queryNum = this.typeValue=='string'?'-1':-1
                if (value==queryNum) {
                  this.model=this.typeValue=='string'?['-1']:[-1];
                  return false;
                }
                if (value!=queryNum && this.model.indexOf(queryNum)>=0) {
                  const index = this.model.indexOf(queryNum);
                  this.removeTag(index);
                }
              }
              this.model.push(value);
              this.broadcast('Drop', 'on-update-popper');
            }

            if (this.filterable && !this.showBottom) {
              // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
              if (this.query !== '') this.selectToChangeQuery = true;
              this.query = '';
              this.$refs.input.focus();
            }
            // if (this.filterable && this.showBottom) {
            //   this.selectToChangeQuery = false;
            // }
          } else {
            this.model = value;
            if(!this.filterable) this.hideMenu();
            if (this.filterable && !this.showBottom) {
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
      this.$nextTick(()=>{
        this.offsetArrow();
      });
      if (this.disabled) {
        this.tabIndex = -1;
      }
    },
    beforeDestroy () {
      off(document,'keydown',this.handleKeydown)
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
      selectedMultiple (val){
        this.$nextTick(()=>{
          this.offsetArrow();
        })
        if (val.length>0&&this.showTitle) {
          let labelarr=[]
          val.forEach((item)=>{
            labelarr.push(item.label);
          })
          this.titleTip = labelarr.join(',');
        }
      },
      model () {
        let backModel = this.arrtoStr(this.model);
        this.$emit('input', backModel);
          this.modelToQuery();
          if (this.multiple) {
            if (this.slotChangeDuration) {
                this.slotChangeDuration = false;
            } else {
                this.updateMultipleSelected();
            }
          } else {
            this.updateSingleSelected();
          }
          if (!this.visible && this.filterable) {
            this.$nextTick(() => {
                this.broadcastQuery('');
            });
          }
      },
      visible (val) {
        if (val) {
          if (this.filterable) {
            if (this.multiple && !this.showBottom) {
              this.$refs.input.focus();
            } else {
              if (this.focusSelect) this.$refs.input.select();
            }
            if (this.remote) {
              this.findChild(child => {
                  child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
              });
              // remote下，设置了默认值，第一次打开时，搜索一次
              const options = this.$slots.default || [];
              if (this.query !== '' && !options.length) {
                  this.remoteMethod(this.query);
              }
            }
          }
          this.broadcast('Drop', 'on-update-popper');
        } else {
          if (this.filterable) {
            this.$refs.input.blur();
            // #566 reset options visible
            setTimeout(() => {
              if (this.showBottom) {this.query='';}
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
              if(this.readonly || this.disabled) return false;
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
            // if(val.trim()) this.broadcastQuery(val);
            this.broadcastQuery(val);

            let is_hidden = true;

            this.$nextTick(() => {
                this.findChild((child) => {
                    if (!child.hidden) {
                        is_hidden = false;
                    }
                });
                this.notFound = is_hidden;
            });
        }
        if (this.filterable&&!this.remote) {
          this.$nextTick(()=>{
            this.focusIndex = 1;
            let index = 0;
            this.findChild(child => {
              if (index==0&& !child.hidden) {
                index++;
                child.isFocus = true;
              }else{
                 child.isFocus = false;
              }
            });
          })
        }
        this.selectToChangeQuery = false;
        this.broadcast('Drop', 'on-update-popper');
      },
      selectedSingle(val){
        this.hideMenu();
        if (val&&this.showTitle) {
          this.titleTip=val
        }
      },
      options(val){
        if (val.length!=0 && this.isfirstSelect) {
          this.model = val[0].value;
          this.isfirstSelect = false;
        }
        if (this.remote) {
          this.$nextTick(()=>{
            this.focusIndex = 1;
            this.findChild(child => {
              if (child.index == 1) {
                child.isFocus = true;
              }
            });
          })
        }
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
