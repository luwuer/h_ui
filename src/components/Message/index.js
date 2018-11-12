import Notification from '../Notice/Notification';

const prefixCls = 'h-message';
const iconPrefixCls = 'h-icon';
const prefixKey = 'h_message_key_';

let defaultDuration = 1.5;
let top;
let messageInstance;
let name = 1;


const iconTypes = {
  'info': 'prompt_fill',
  'success': 'success_fill',
  'warning': 'warning_fill',
  'error': 'delete_fill',
  'loading': 'load-c'
};

function getMessageInstance () {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls: prefixCls,
    styles: {
        top: `${top}px`
    }
  });

  return messageInstance;
}

function notice (content = '', duration = defaultDuration, type, onClose = function () {}, closable = false) {
  const iconType = iconTypes[type];

  // if loading
  const loadCls = type === 'loading' ? ' h-load-loop' : '';

  let instance = getMessageInstance();

  instance.notice({
    name: `${prefixKey}${name}`,
    duration: duration,
    styles: {},
    transitionName: 'move-up',
    content: `
      <div class="${prefixCls}-custom-content ${prefixCls}-${type}">
        <i class="iconfont icon-${iconType}${loadCls} ${iconPrefixCls} ${iconPrefixCls}-${iconType}"></i>
        <span>${content}</span>
      </div>
    `,
    onClose: onClose,
    closable: closable,
    type: 'message'
  });

  // 用于手动消除
  return (function () {
    let target = name++;

    return function () {
        instance.remove(`${prefixKey}${target}`);
    };
  })();
}

export default {
  info (options) {
    const type = typeof options;
    if (type === 'string') {
        options = {
            content: options
        };
    }
    return notice(options.content, options.duration, 'info', options.onClose, options.closable);
  },
  success (options) {
    const type = typeof options;
    if (type === 'string') {
        options = {
            content: options
        };
    }
    return notice(options.content, options.duration, 'success', options.onClose, options.closable);
  },
  warning (options) {
    const type = typeof options;
    if (type === 'string') {
        options = {
            content: options
        };
    }
    return notice(options.content, options.duration, 'warning', options.onClose, options.closable);
  },
  error (options) {
    const type = typeof options;
    if (type === 'string') {
        options = {
            content: options
        };
    }
    return notice(options.content, options.duration, 'error', options.onClose, options.closable);
  },
  loading (options) {
    const type = typeof options;
    if (type === 'string') {
        options = {
            content: options
        };
    }
    return notice(options.content, options.duration, 'loading', options.onClose, options.closable);
  },
  config (options) {
    if (options.top || options.top === 0) {
      top = options.top;
    }
    if (options.duration || options.duration === 0) {
      defaultDuration = options.duration;
    }
  },
  destroy () {
    let instance = getMessageInstance();
    messageInstance = null;
    instance.destroy('h-message');
  }
};