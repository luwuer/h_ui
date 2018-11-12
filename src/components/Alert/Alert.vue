<template>
  <transition name="fade">
    <div v-if="!closed" :class="wrapClasses">
      <span :class="iconClasses" v-if="showIcon">
        <slot name="icon">
          <Icon :name="iconType"></Icon>
        </slot>
      </span>
      <span :class="messageClasses"><slot></slot></span>
      <span :class="descClasses"><slot name="desc"></slot></span>
      <a :class="closeClasses" v-if="closable" @click="close">
        <slot name="close">
          <Icon name="close"></Icon>
        </slot>
      </a>
    </div>
  </transition>
</template>
<script>
import Icon from '../Icon/Icon.vue';
import { oneOf } from '../../util/tools';

const prefixCls = 'h-alert';

export default {
  name: 'Alert',
  components: { Icon },
  props: {
    type: {
      validator (value) {
          return oneOf(value, ['success', 'info', 'warning', 'error']);
      },
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    banner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      closed: false,
      desc: false
    };
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-icon`]: this.showIcon,
          [`${prefixCls}-with-desc`]: this.desc,
          [`${prefixCls}-with-banner`]: this.banner
        }
      ];
    },
    messageClasses () {
      return `${prefixCls}-message`;
    },
    descClasses () {
      return `${prefixCls}-desc`;
    },
    closeClasses () {
      return `${prefixCls}-close`;
    },
    iconClasses () {
      return `${prefixCls}-icon`;
    },
    iconType () {
      let type = '';

      switch (this.type) {
        case 'success':
          type = 'success_fill';
          break;
        case 'info':
          type = 'prompt_fill';
          break;
        case 'warning':
          type = 'warning_fill';
          break;
        case 'error':
          type = 'delete_fill';
          break;
      }

      return type;
    }
  },
  methods: {
    close (e) {
      this.closed = true;
      this.$emit('on-close', e);
    }
  },
  mounted () {
    this.desc = this.$slots.desc !== undefined;
  }
};
</script>
