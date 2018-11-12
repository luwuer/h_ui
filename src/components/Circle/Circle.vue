<template>
  <div :style="circleSize" :class="wrapClasses">
    <svg viewBox="0 0 100 100">
      <path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0"/>
      <path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="colors" :stroke-width="strokeWidth" fill-opacity="0" :style="pathStyle"/>
    </svg>
    <div :class="innerClasses">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import { oneOf } from '../../util/tools';

  const prefixCls = 'h-chart-circle';

  export default {
    name: 'Circles',
    data(){
      return{
        colors:''
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      },
      size: {
        type: Number,
        default: 120
      },
      strokeWidth: {
        type: Number,
        default: 6
      },
      strokeColor: {
        type: String,
        default: '#298DFF'
      },
      strokeLinecap: {
        validator (value) {
          return oneOf(value, ['square', 'round']);
        },
        default: 'round'
      },
      trailWidth: {
        type: Number,
        default: 5
      },
      trailColor: {
        type: String,
        default: ' #F7F7F7'
      }
    },
    computed: {
      circleSize () {
        return {
          width: `${this.size}px`,
          height: `${this.size}px`
        };
      },
      radius () {
        return 50 - this.strokeWidth / 2;
      },
      pathString () {
        return `M 50,50 m 0,-${this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
      },
      len () {
        return Math.PI * 2 * this.radius;
      },
      pathStyle () {
        return {
          'stroke-dasharray': `${this.len}px ${this.len}px`,
          'stroke-dashoffset': `${((100 - this.percent) / 100 * this.len)}px`,
          'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      wrapClasses () {
        return `${prefixCls}`;
      },
      innerClasses () {
        return `${prefixCls}-inner`;
      }
    },
    methods:{
      changeColor(){//ie firefox 起始样式兼容处理 bug 65986
        this.colors=this.strokeColor;
        if (this.percent==0) {
          this.colors=''
        }
      }
    },
    watch:{
      percent(){
        this.changeColor();
      }
    },
    mounted(){
      this.changeColor();
    }
  };
</script>
