<template>
  <div :class="[prefixCls]">
    <div :class="[prefixCls + '-rel']" ref="reference" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">
      <slot></slot>
    </div>
    <transition name="fade">
      <div :class="[prefixCls + '-popper']" 
        ref="popper" 
        v-show="!disabled && (visible || always)"
        @mouseenter="handleShowPopper($event,true)"
        @mouseleave="handleClosePopper"
        :data-transfer="transfer"
        v-transfer-dom>
        <div :class="[prefixCls + '-content']">
          <div :class="[prefixCls + '-arrow']"></div>
          <div :class="[prefixCls + '-inner']"><slot name="content">{{ content }}</slot></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import Popper from '../Notice/popper.js';
  import TransferDom from '../../directives/transfer-dom';
  import { oneOf } from '../../util/tools';

  const prefixCls = 'h-tooltip';

  export default {
    name: 'Tooltip',
    directives: { TransferDom },
    mixins: [Popper],
    props: {
      placement: {
        validator (value) {
          return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
        },
        default: 'bottom'
      },
      content: {
        type: [String, Number],
        default: ''
      },
      delay: {
          type: Number,
          default: 0
      },
      disabled: {
          type: Boolean,
          default: false
      },
      controlled: {    // under this prop,Tooltip will not close when mouseleave
          type: Boolean,
          default: false
      },
      always: {
          type: Boolean,
          default: false
      },
      transfer: {
        type: Boolean,
        default: false
      },
      imdiaClose:{
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
          prefixCls: prefixCls
      };
    },
    methods: {
      handleShowPopper(event,status=false) {
        if(this.imdiaClose&&status)return;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.visible = true;
        }, this.delay);
      },
      handleClosePopper() {
        if (this.timeout) {
          clearTimeout(this.timeout);
          if (!this.controlled) {
            this.timeout = setTimeout(() => {
              this.visible = false;
            }, 100);
          }
        }
      }
    },
    mounted(){
      if (this.always) {
        this.updatePopper();
      }
    },
    beforeDestroy(){
      // this.destroyPopper();
    }
  };
</script>
