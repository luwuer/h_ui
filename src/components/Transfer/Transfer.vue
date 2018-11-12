<script>
  import List from './List.vue';
  import Operation from './Operation.vue';
  import Locale from '../../mixins/locale';
  import Emitter from '../../mixins/emitter';
  import {deepCopy} from '../../util/tools'

  const prefixCls = 'h-transfer';

  export default {
    name: 'Transfer',
    mixins: [ Emitter, Locale ],
    render (h) {
      function cloneVNode (vnode) {
        const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
        const cloned = h(vnode.tag, vnode.data, clonedChildren);
        cloned.text = vnode.text;
        cloned.isComment = vnode.isComment;
        cloned.componentOptions = vnode.componentOptions;
        cloned.elm = vnode.elm;
        cloned.context = vnode.context;
        cloned.ns = vnode.ns;
        cloned.isStatic = vnode.isStatic;
        cloned.key = vnode.key;
        return cloned;
      }

      const vNodes = this.$slots.default === undefined ? [] : this.$slots.default;
      const opNodes = this.$slots.operation === undefined ? [] : this.$slots.operation;
      const clonedVNodes = this.$slots.default === undefined ? [] : vNodes.map(vnode => cloneVNode(vnode));

      return h('div', {
        'class': this.classes
      }, [
        h(List, {
          ref: 'left',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.leftData,
            renderFormat: this.renderFormat,
            checkedKeys: this.leftCheckedKeys,
            validKeysCount: this.leftValidKeysCount,
            listStyle: this.listStyle,
            title: this.localeTitles[0],
            filterable: this.filterable,
            filterPlaceholder: this.localeFilterPlaceholder,
            filterMethod: this.filterMethod,
            notFoundText: this.localeNotFoundText,
            notFoundData: this.localeNotFoundData,
            direcPanel:'left',
          },
          on: {
            'on-checked-keys-change': this.handleLeftCheckedKeysChange
          }
        }, [vNodes,]),

        h(Operation, {
          props: {
            prefixCls: this.prefixCls,
            operations: this.operations,
            leftActive: this.leftValidKeysCount > 0,
            rightActive: this.rightValidKeysCount > 0
          }
        },[opNodes]),

        h(List, {
          ref: 'right',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.rightData,
            renderFormat: this.renderFormat,
            checkedKeys: this.rightCheckedKeys,
            validKeysCount: this.rightValidKeysCount,
            listStyle: this.listStyle,
            title: this.localeTitles[1],
            filterable: this.filterable,
            filterPlaceholder: this.localeFilterPlaceholder,
            filterMethod: this.filterMethod,
            notFoundText: this.localeNotFoundText,
            notFoundData: this.localeNotFoundData,
            direcPanel:'right',
          },
          on: {
            'on-checked-keys-change': this.handleRightCheckedKeysChange,
            'on-right-drag-change': this.handleRightDragChange
          }
        }, clonedVNodes)
      ]);
    },
    props: {
      data: {
        type: Array,
        default () {
            return [];
        }
      },
      renderFormat: {
        type: Function,
        default (item) {
            return item.label || item.key;
        }
      },
      targetKeys: {
        type: Array,
        default () {
            return [];
        }
      },
      selectedKeys: {
        type: Array,
        default () {
            return [];
        }
      },
      listStyle: {
        type: Object,
        default () {
            return {};
        }
      },
      titles: {
        type: Array
      },
      operations: {
        type: Array,
        default () {
            return [];
        }
      },
      filterable: {
        type: Boolean,
        default: false
      },
      filterPlaceholder: {
        type: String
      },
      filterMethod: {
        type: Function,
        default (data, query) {
          const type = ('label' in data) ? 'label' : 'key';
          return data[type].indexOf(query) > -1;
        }
      },
      notFoundText: {
          type: String
      },
      notFoundData: {
        type: String
      },
      contentSplit:{//理财5.0，穿梭左右联动分离 
        type:Boolean,
        default:false
      },
    },
    data () {
      return {
        prefixCls: prefixCls,
        leftData: [],
        rightData: [],
        leftCheckedKeys: [],
        rightCheckedKeys: []
      };
    },
    computed: {
      classes () {
          return [
              `${prefixCls}`
          ];
      },
      leftValidKeysCount () {
          return this.getValidKeys('left').length;
      },
      rightValidKeysCount () {
          return this.getValidKeys('right').length;
      },
      localeFilterPlaceholder () {
        if (this.filterPlaceholder === undefined) {
          return this.t('i.transfer.filterPlaceholder');
        } else {
          return this.filterPlaceholder;
        }
      },
      localeNotFoundText () {
        if (this.notFoundText === undefined) {
          return this.t('i.transfer.notFoundText');
        } else {
          return this.notFoundText;
        }
      },
      localeNotFoundData () {
        if (this.notFoundData === undefined) {
          return this.t('i.transfer.notFoundData');
        } else {
          return this.notFoundData;
        }
      },
      localeTitles () {
        if (this.titles === undefined) {
          return [this.t('i.transfer.titles.source'), this.t('i.transfer.titles.target')];
        } else {
          return this.titles;
        }
      }
    },
    methods: {
      getValidKeys (direction) {
        return this[`${direction}Data`].filter(data => !data.disabled && this[`${direction}CheckedKeys`].indexOf(data.key) > -1).map(data => data.key);
      },
      getAllKeys (direction) {
        return this[`${direction}Data`].filter(data => !data.disabled).map(data => data.key);;
      },
      splitData (init = false) {
          this.leftData = [...this.data];
          this.rightData = [];
          if (this.targetKeys.length > 0) {
            this.targetKeys.forEach((targetKey) => {
              const filteredData = this.leftData.filter((data, index) => {
                if (data.key === targetKey) {
                  if(!this.contentSplit) this.leftData.splice(index, 1);
                  return true;
                }
                return false;
              });
              if (filteredData && filteredData.length > 0) this.rightData.push(filteredData[0]);
            });
          }
          if (init) {
            this.splitSelectedKey();
          }
      },
      addRight(item){
        const curInx = this.leftCheckedKeys.indexOf(item.key);
        if(curInx==-1) this.leftCheckedKeys.push(item.key);
        this.rightData.push(item);
        this.rightChange();
      },
      deleteRight(item){
        const curInx = this.leftCheckedKeys.indexOf(item.key);
        if(curInx>-1) this.leftCheckedKeys.splice(curInx,1);
        let index=-1;
        this.rightData.forEach((col,i)=>{
          if(col.key == item.key){
            index=i;
          }
        })
        this.rightData.splice(index,1);     
        this.rightChange();
      },
      operationsChange(){
        const keys = this.leftData.filter(data => !data.disabled || this.checkedKeys.indexOf(data.key) > -1).map(data => data.key)
        this.leftCheckedKeys = keys;
        this.changeRight(true)
      },
      changeRight(status){
        if(status){
          this.rightData=deepCopy(this.leftData);
        }else{
          this.rightData=[];
          this.leftCheckedKeys = [];
        }
        this.rightChange();
      },
      rightChange(){
        this.$emit('on-change',this.rightData);
        this.dispatch('FormItem', 'on-form-change', {
          tarketKeys: this.rightData,
        });
      },
      splitSelectedKey () {
        const selectedKeys = this.selectedKeys;
        if (selectedKeys.length > 0) {
          this.leftCheckedKeys = this.leftData
            .filter(data => selectedKeys.indexOf(data.key) > -1)
            .map(data => data.key);
          this.rightCheckedKeys = this.rightData
            .filter(data => selectedKeys.indexOf(data.key) > -1)
            .map(data => data.key);
        }
      },
      moveTo (direction) {
        const targetKeys = this.targetKeys;
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.getValidKeys(opposite); 
        const newTargetKeys = direction === 'right' ?
          moveKeys.concat(targetKeys) :
          targetKeys.filter(targetKey => !moveKeys.some(checkedKey => targetKey === checkedKey));

        this.$refs[opposite].toggleSelectAll(false);
        this.$emit('on-change', newTargetKeys, direction, moveKeys);
        this.dispatch('FormItem', 'on-form-change', {
          tarketKeys: newTargetKeys,
          direction: direction,
          moveKeys: moveKeys
        });
      },
      moveAllTo (direction) {
        const targetKeys = this.targetKeys;
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.getAllKeys(opposite);
        
        const newTargetKeys = direction === 'right' ?
                moveKeys.concat(targetKeys) :
                targetKeys.filter(targetKey => !moveKeys.some(checkedKey => targetKey === checkedKey));
        this.$emit('on-change', newTargetKeys, direction, moveKeys);
        this.dispatch('FormItem', 'on-form-change', {
            tarketKeys: newTargetKeys,
            direction: direction,
            moveKeys: moveKeys 
        });
      },
      handleLeftCheckedKeysChange (keys) {
        this.leftCheckedKeys = keys;
      },
      handleRightCheckedKeysChange (keys) {
        this.rightCheckedKeys = keys;
      },
      handleRightDragChange (data) {
        this.$emit('on-right-drag', data)
      }
    },
    watch: {
      targetKeys () {
        this.splitData(false);
      },
      data () {
        this.splitData(false);
      }
    },
    mounted () {
      this.splitData(true);
    }
  };
</script>
