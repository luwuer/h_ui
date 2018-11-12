<template>
    <div :class="classes" :style="styles" @click="backbottom">
        <slot>
            <div :class="innerClasses">
                <Icon name="arrow-down-c"></Icon>
            </div>
         </slot>
    </div>
</template>
<script>
import { scrollTop } from '../../util/tools';
import { on, off } from '../../util/dom';
import Icon from '../Icon/Icon.vue';

const prefixCls = 'h-back-bottom';


export default {
    name: 'GoBottom',
    components: { Icon },
    props: {
        reserveHeight: {  // 预留距离底部高度 backbottom消失
            type: [String, Number],
            default: 400
        },
        top: {
            type: [String, Number],
            default:30
        },
        right: {
            type: [String, Number],
            default: 30
        },
        duration: {
            type: [String, Number],
            default: 1000
        }
    },
    data () {
        return {
            hideBottom: false
        };
    },
    mounted () {
        on(window, 'scroll', this.handleScroll);
        on(window, 'resize', this.handleScroll);
    },
    beforeDestroy () {
        off(window, 'scroll', this.handleScroll);
        off(window, 'resize', this.handleScroll);
    },
    computed: {
        classes () {
            return [
                `${prefixCls}`,
                {              
                    [`${prefixCls}-hidden`]: this.hideBottom
                }
            ];
        },
        styles () {
            return {
                top: `${this.top}px`,
                right: `${this.right}px`
            };
        },
        innerClasses () {
            return `${prefixCls}-inner`;
        },
        innerClassesMinusBottom () {
            return `${prefixCls}-inner-innerminusbottom`;
        }
    },
    methods: {
        handleScroll () {
            const pageHeight = document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight; 
            this.hideBottom = window.pageYOffset >= ( pageHeight-clientHeight-this.reserveHeight); 
        },
        backbottom () {
            const sTop = document.documentElement.scrollTop || document.body.scrollTop;
            const pageHeight = document.body.scrollHeight;
            scrollTop(window, sTop, pageHeight, this.duration);
            this.$emit('on-click');
        }
    }
};
</script>
