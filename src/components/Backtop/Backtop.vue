<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <Icon name="arrow-up-c"></Icon>
            </div>
        </slot>
    </div>
</template>
<script>
import { scrollTop } from '../../util/tools';
import { on, off } from '../../util/dom';
import Icon from '../Icon/Icon.vue';

// const prefixCls = 'h-back-all';
const prefixCls = 'h-back-top';


export default {
    name: 'BackTop',
    components: { Icon },
    props: {
        height: {
            type: [String, Number],
            default: 400
        },
        bottom: {
            type: [String, Number],
            default: 30
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
            backTop:false,
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
                    [`${prefixCls}-show`]: this.backTop,              
                }
            ];
        },
        styles () {
            return {
                bottom: `${this.bottom}px`,
                right: `${this.right}px`
            };
        },
        innerClasses () {
            return `${prefixCls}-inner`;
        },
        innerClassesMinus () {
            return `${prefixCls}-inner-innerminus`;
        }
    },
    methods: {
        handleScroll () {
            this.backTop = window.pageYOffset >= this.height;
        },
        back () {
            const sTop = document.documentElement.scrollTop || document.body.scrollTop;
            scrollTop(window, sTop, 0, this.duration);
            this.$emit('on-click');
        }
    }
};
</script>
