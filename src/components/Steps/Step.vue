<template>
  <div :class="wrapClasses" :style="styles">
    <div :class="[prefixCls + '-tail']"><i></i></div>
    <div :class="[prefixCls + '-head']">
      <div :class="[prefixCls + '-head-inner']" @click.stop.prevent="handleStepItem">
        <span v-if="isRemark" @click.stop.prevent="handleRemark" :class="remarkClass"></span>
        <span v-if="!icon && currentStatus != 'finish' && currentStatus != 'error' && (currentStatus == 'process' && processIcon == '' || currentStatus == 'wait' && waitIcon == '')">{{ stepNumber }}</span>
        <span v-else :class="iconClasses"></span>
      </div>
    </div>
    <div :class="[prefixCls + '-main']">
      <div :class="[prefixCls + '-title']">{{ title }}</div>
       <div :class="[prefixCls + '-content']" v-if="content || $slots">
        <slot>
          {{ content }}
        </slot>
      </div> 
      <!-- <slot>
        <div v-if="content" :class="[prefixCls + '-content']">{{ content }}</div>
      </slot> -->
    </div>
  </div>
</template>
<script>
  import { oneOf } from '../../util/tools';

  const prefixCls = 'h-steps';

  export default {
    name: 'Step',
    props: {
        status: {
            validator (value) {
                return oneOf(value, ['wait', 'process', 'finish', 'error']);
            }
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String
        },
        icon: {
            type: String
        },
        isRemark: {
          type: Boolean,
          default: false
        },
        remarkIcon: {
          type: String,
          default: 'alert'
        }
    },
    data () {
        return {
            prefixCls: prefixCls,
            stepNumber: '',
            nextError: false,
            total: 1,
            currentStatus: '',
            waitIcon: this.$parent.waitIcon,
            processIcon: this.$parent.processIcon,
            finishIcon: this.$parent.finishIcon,
            errorIcon:  this.$parent.errorIcon,
        };
    },
    created () {
      this.currentStatus = this.status;
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-item`,
          `${prefixCls}-status-${this.currentStatus}`,
          {
            [`${prefixCls}-custom`]: !!this.icon,
            [`${prefixCls}-next-error`]: this.nextError
          }
        ];
      },
      iconClasses () {
        let icon = '';

        if (this.icon) {
          icon = this.icon;
        } else {
          // 根据不同状态设置对应图标
          if (this.currentStatus == 'finish') {
            // icon = 'right';
            icon = this.finishIcon
          } else if (this.currentStatus == 'error') {
            // icon = 'close';
            icon = this.errorIcon
          } else if (this.currentStatus == 'process') {
            icon = this.processIcon
          } else if (this.currentStatus == 'wait') {
            icon = this.waitIcon
          }
        }

        return [
          `${prefixCls}-icon`,
          `iconfont`,
          {
            [`icon-${icon}`]: icon != ''
          }
        ];
      },
      remarkClass () {
        return [
          `${prefixCls}-remark`,
          `${prefixCls}-icon`,
          `iconfont`,
          `icon-${this.remarkIcon}`
        ];
      },
      styles () {
        return {
          width: `${1/this.total*100}%`
        };
      }
    },
    watch: {
      status (val) {
        this.currentStatus = val;
        if (this.currentStatus == 'error') {
          this.$parent.setNextError();
        }
      }
    },
    methods: {
      handleRemark () {
        this.$emit('on-step-remark')
      },
      handleStepItem () {
        this.$emit('on-current-step', this.stepNumber - 1)
      }
    }
  };
</script>
