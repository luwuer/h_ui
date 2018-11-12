<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script>
  import { oneOf } from '../../util/tools';

  const prefixCls = 'h-steps';

  export default {
    name: 'Steps',
    props: {
      current: {
        type: Number,
        default: 0
      },
      status: {
        validator (value) {
          return oneOf(value, ['wait', 'process', 'finish', 'error']);
        },
        default: 'process'
      },
      size: {
        validator (value) {
          return oneOf(value, ['small']);
        }
      },
      direction: {
        validator (value) {
          return oneOf(value, ['horizontal', 'vertical']);
        },
        default: 'horizontal'
      },
      processIcon: {
        type: String,
        default: ""
      },
      waitIcon: {
        type: String,
        default: ""
      },
      finishIcon: {
        type: String,
        default: "right"
      },
      errorIcon: {
        type: String,
        default: "close"
      }
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          `${prefixCls}-${this.direction}`,
          {
            [`${prefixCls}-${this.size}`]: !!this.size
          }
        ];
      }
    },
    mounted () {
      this.updateChildProps(true);
      this.setNextError();
      this.updateCurrent(true);
    },
    updated () {
      this.updateChildProps()
    },
    methods: {
      updateChildProps (isInit) {
        const total = this.$children.length;
        this.$children.forEach((child, index) => {
            child.stepNumber = index + 1;

            if (this.direction === 'horizontal') {
                child.total = total;
            }

            // 如果已存在status,且在初始化时,则略过
            // todo 如果当前是error,在current改变时需要处理
            if (!(isInit && child.currentStatus)) {
                if (index == this.current) {
                    if (this.status != 'error') {
                        child.currentStatus = 'process';
                    }
                } else if (index < this.current) {
                    child.currentStatus = 'finish';
                } else {
                    child.currentStatus = 'wait';
                }
            }

            if (child.currentStatus != 'error' && index != 0) {
                this.$children[index - 1].nextError = false;
            }
        });
      },
      setNextError () {
        this.$children.forEach((child, index) => {
            if (child.currentStatus == 'error' && index != 0) {
                this.$children[index - 1].nextError = true;
            }
        });
      },
      updateCurrent (isInit) {
        // 防止溢出边界
        if (this.current < 0 || this.current >= this.$children.length ) {
          return;
        }
        if (isInit) {
          const current_status = this.$children[this.current].currentStatus;
          if (!current_status) {
              this.$children[this.current].currentStatus = this.status;
          }
        } else {
          this.$children[this.current].currentStatus = this.status;
        }
      }
    },
    watch: {
      current () {
        this.updateChildProps();
      },
      status () {
        this.updateCurrent();
      }
    }
  };
</script>
