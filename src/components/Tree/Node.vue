<template>
  <collapse-transition>
    <!-- <ul :class="classes" v-show="visible"> -->
    <ul :class="classes">
      <li>
        <div :class="`${prefixCls}-item`" tabindex="-1" @keydown="handleKeydown">
          <span :class="arrowClasses" @click="handleExpand">
            <Icon v-if="showArrow" name="ios-arrow-right"></Icon>
            <Icon v-if="showLoading" name="load-c" class="h-load-loop"></Icon>
          </span>
          <h-checkbox
            v-if="showCheckbox"
            :value="data.checked"
            :indeterminate="data.indeterminate"
            :disabled="data.disabled || data.disableCheckbox"
            @click.native.prevent="handleCheck"></h-checkbox>
          <Render v-if="data.render" :render="data.render" :data="data" :node="node"></Render>
          <Render v-else-if="isParentRender" :render="parentRender" :data="data" :node="node"></Render>
          <span v-else :class="titleClasses" @click="handleSelect">{{data.title}}</span>        
        </div>
        <Tree-node
          v-if="data.expand && data.expand!='false' && (!data.leaf||data.leaf=='false')"
          v-for="(item,i) in data.children"
          :key="i"
          :data="item"
          :multiple="multiple"
          :checkStrictly="checkStrictly"
          :selectToCheck="selectToCheck"
          :showIndeterminate="showIndeterminate"
          :show-checkbox="showCheckbox">
        </Tree-node>
      </li>
    </ul>
  </collapse-transition>
</template>
<script>
  import Checkbox from '../Checkbox/Checkbox.vue';
  import Icon from '../Icon/Icon.vue';
  import Render from './render';
  import CollapseTransition from '../Notice/collapse-transition';
  import Emitter from '../../mixins/emitter';
  import { findComponentsUpward,findComponentsDownward } from '../../util/tools';

  const prefixCls = 'h-tree';

  export default {
    name: 'TreeNode',
    mixins: [ Emitter ],
    components: { Checkbox, Icon, CollapseTransition, Render},
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      checkStrictly:{
        type:Boolean
      },
      showIndeterminate:{
        type:Boolean
      },
      selectToCheck:Boolean,
      // visible: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data () {
      return {
        prefixCls: prefixCls,
        indeterminate: false
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}-children`
        ];
      },
      selectedCls () {
        return [
          {
            [`${prefixCls}-node-selected`]: this.data.selected
          }
        ];
      },
      arrowClasses () {
        return [
          `${prefixCls}-arrow`,
          {
            [`${prefixCls}-arrow-disabled`]: this.data.disabled,
            [`${prefixCls}-arrow-open`]: this.data.expand && this.data.expand!='false',
            // [`${prefixCls}-arrow-hidden`]: !(this.data.children && this.data.children.length)
          }
        ];
      },
      titleClasses () {
        return [
          `${prefixCls}-title`,
          {
            [`${prefixCls}-title-selected`]: this.data.selected||(this.selectToCheck&&this.data.checked),
            [`${prefixCls}-title-filterable`]: this.data.filterable,
            [`${prefixCls}-title-parent`]: this.showArrow,
          }
        ];
      },
      showArrow () {
        // 添加leaf子节点属性--fof系统（数据库存在loading字段，无论loading为true或false,均会被渲染成父节点）
        return (this.data.children && this.data.children.length) && (!this.data.leaf||this.data.leaf=='false') || ('loading' in this.data && (!this.data.loading||this.data.loading=='false')) && (!this.data.leaf||this.data=='false');
      },
      showLoading () {
        // 添加leaf子节点属性--fof系统（数据库存在loading字段，无论loading为true或false,均会被渲染成父节点）
        return 'loading' in this.data && this.data.loading && (!this.data.leaf||this.data.leaf=='false')&&this.data.loading!='false';
      },
      isParentRender () {
        const Tree = findComponentsUpward(this, 'Tree');
        return Tree && Tree.render;
      },
      parentRender () {
        const Tree = findComponentsUpward(this, 'Tree');
        if (Tree && Tree.render) {
            return Tree.render;
        } else {
            return null;
        }
      },
      node () {
        const Tree = findComponentsUpward(this, 'Tree');
        if (Tree) {
            // 将所有的 node（即flatState）和当前 node 都传递
            return [Tree.flatState, Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)];
        } else {
            return [];
        }
      }
    },
    watch:{
      'data.autoLoad': function (val,oldVal) {
        if (val&&val!='false'&&(!oldVal||oldVal=='false')) {
          this.handleExpand()
        }
      },
      'data.currentPage': function (val) { //默认为1
        const item = this.data;
        if (val && this.data.hasPage) {
          const tree = findComponentsUpward(this, 'Tree');
          if (tree && tree.loadData) {
            tree.loadData(item, children => {
              if (children.length) {
                this.$set(this.data, 'children', children);
              }
            });
            return;
          }
        }
      }
    },
    methods: {
      handleExpand () {
        const item = this.data;
        if (item.disabled) return;
        // async loading
        if (item.children.length === 0) {
          const tree = findComponentsUpward(this, 'Tree');
          if (tree && tree.loadData) {
            this.$set(this.data, 'loading', true);
            tree.loadData(item, children => {
              this.$set(this.data, 'loading', false);
              if (children.length) {
                this.$set(this.data, 'children', children);
                this.$nextTick(() => this.handleExpand());
              }
            });
            return;
          }
        }
        if (item.children && item.children.length) {
          // 问题：autoLoad为true时，expand设置无效，原因：autoLoad会触发两次expand
          // 解决：需动态管理autoLoad，在有子数据时，关闭autoLoad,expand维持原有值，autoLoad为false时，触发expand切换，兼容点击按钮进行loadData方式
          let status = Boolean(this.data.expand&&this.data.expand!='false');
          if (this.data.autoLoad && this.data.autoLoad!='false') {
            // this.$set(this.data, 'autoLoad', !this.data.autoLoad);
            this.$set(this.data, 'autoLoad', false);
            this.$set(this.data, 'expand', status);
          } else {
            this.$set(this.data, 'expand', !status);
            this.dispatch('Tree', 'toggle-expand', this.data);
          }
          // this.$set(this.data, 'expand', !this.data.expand);
          // this.dispatch('Tree', 'toggle-expand', this.data);
        }
      },
      handleSelect () {
        if (this.data.disabled) return;
        if(this.selectToCheck && this.showCheckbox){
          this.handleCheck();
        }else{
          this.dispatch('Tree', 'on-selected', this.data.nodeKey);
        }
      },
      handleKeydown (e) {
        let code  = e.keyCode;
        if (code == 37) {//left
          this.$set(this.data, 'expand', false);
          this.dispatch('Tree', 'toggle-expand', this.data);
        }
        if (code == 39) {//right
          this.$set(this.data, 'expand', true);
          this.dispatch('Tree', 'toggle-expand', this.data);
        }
      },
      handleCheck () {
        if (this.data.disabled) return;
        var checked;
        if (!!this.checkStrictly || !!this.showIndeterminate) {
          checked = !this.data.checked;
        }else{
          checked = !this.data.checked && !this.data.indeterminate
        }
        const changes = {
            checked: checked,
            nodeKey: this.data.nodeKey
        };
        this.dispatch('Tree', 'on-check', changes);
      }
    },
    created () {
      // if (!!this.checkStrictly || !!this.showIndeterminate) {
      //   this.data.indeterminate=false;
      // }
      // created node.vue first, mounted tree.vue second
      // if (!this.data.checked) this.$set(this.data, 'checked', false);
      // tree分页
      // 若autoLoad为true 则自动展开并触发loadData -- fof章杰灵提出
      if (this.data.autoLoad && this.data.autoLoad!='false') {
        this.handleExpand()
      }
    },
    mounted () {
      // this.$refs.item.addEventListener('keydown', this.handleKeydown);
      // this.$on('indeterminate', () => {
      //   this.broadcast('TreeNode', 'indeterminate');
      //   this.setIndeterminate();
      // });
    }
  };
</script>