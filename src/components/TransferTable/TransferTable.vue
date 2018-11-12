<script>
  import List from './List.vue';
  import Operation from './Operation.vue';
  import Locale from '../../mixins/locale';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-transfer-table';

  export default {
    name: 'TransferTable',
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
      const clonedVNodes = this.$slots.default === undefined ? [] : vNodes.map(vnode => cloneVNode(vnode));

      return h('div', {
        'class': this.classes
      }, [
        h(List, {
          ref: 'left',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.leftData,
            columns:this.lColumns,
            stripe:this.stripe,
            border:this.border,
            width:this.lWidth,
            height:this.height,
            rowSelect:this.rowSelect,
            highlightRow:this.highlightRow,
            showEditInput:this.showEditInput,
            option:this.option,
            title: this.leftTitles,
            notData:this.LocalnotDataText,
            option:this.option,
            treeOption:this.treeOption,
            showTitle:this.showTitle,
          },
          on: {
            // 'on-checked-keys-change': this.handleLeftCheckedKeysChange
          }
        }, vNodes),

        h(Operation, {
          props: {
            prefixCls: this.prefixCls,
            operations: this.operations,
            leftActive: this.leftValidKeysCount > 0,
            rightActive: this.rightValidKeysCount > 0
          }
        }),

        h(List, {
          ref: 'right',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.rightData,
            columns:this.rColumns,
            stripe:this.stripe,
            border:this.border,
            width:this.rWidth,
            height:this.height,
            rowSelect:this.rowSelect,
            highlightRow:this.highlightRow,
            showEditInput:this.showEditInput,
            option:this.option,
            title: this.rightTitles,
            notData:this.LocalnotDataText,
            option:this.option,
            treeOption:this.treeOption,
            showTitle:this.showTitle,
          },
          on: {
            // 'on-checked-keys-change': this.handleRightCheckedKeysChange
          }
        }, clonedVNodes)
      ]);
    },
    props: {
      lColumns:{
        type: Array,
        default () {
            return [];
        }
      },
      rColumns:{
        type: Array,
        default () {
            return [];
        }
      },
      lData: {
        type: Array,
        default:[],
      },
      rData: {
        type: Array,
        default :[],
      },
      lWidth:{
        type:Number,
        default:500
      },
      rWidth:{
        type:Number,
        default:400
      },
      height:{
        type:Number,
        default:300
      },
      lTitle:String,
      rTitle:String,
      operations: {//操作文案集合 从上至下
        type: Array,
        default () {
            return [];
        }
      },
      notDataText:String,
      showTitle:{
        type:Boolean,
        default:true
      },
      stripe:{
        type:Boolean,
        default:false
      },
      border:{
        type:Boolean,
        default:true
      },
      rowSelect:{
        type:Boolean,
        default:false
      },
      highlightRow:{
        type:Boolean,
        default:false
      },
      showEditInput:{
        type:Boolean,
        default:false
      },
      option:Array,
      treeOption:Array,
    },
    data () {
      return {
        prefixCls: prefixCls,
        leftData: [],
        rightData: [],
      };
    },
    computed: {
      classes () {
          return [
              `${prefixCls}`
          ];
      },
      leftValidKeysCount () {
          return this.leftData.length;
      },
      rightValidKeysCount () {
          return this.rightData.length;
      },
      localeFilterPlaceholder () {
        if (this.filterPlaceholder === undefined) {
          return this.t('i.transfer.filterPlaceholder');
        } else {
          return this.filterPlaceholder;
        }
      },
      LocalnotDataText(){
        if (this.notDataText == undefined) {
          return this.t('i.transferTable.notFoundData');
        }else{
          return this.notDataText;
        }
      },
      leftTitles(){
        if (this.lTitle) {
          return this.lTitle;
        }else{
          return this.t('i.transferTable.lTitle');
        }
      },
      rightTitles(){
        if (this.rTitle) {
          return this.rTitle;
        }else{
          return this.t('i.transferTable.rTitle');
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
      getAllKeys (direction) {
        const objData = this.$refs[direction].$refs.table.cloneData;
        return objData.filter(data => !data.disabled);
      },
      moveTo (direction) {
        const lCData = this.$refs.left.$refs.table.cloneData;
        const rCData = this.$refs.right.$refs.table.cloneData;
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.$refs[opposite].$refs.table.getSelection(); 
        const moveIndex = this.$refs[opposite].$refs.table. getSelection('transfer');
        if (direction === 'right') {
          this.rightData = moveKeys.concat(rCData)
          this.leftData = lCData.filter((col,i)=>!moveIndex.some(index => i == index));
        }else{
          this.leftData = moveKeys.concat(lCData)
          this.rightData = rCData.filter((col,i)=>!moveIndex.some(index => i == index));
        }
        this.$emit('on-change', rCData, direction, moveKeys);
        this.dispatch('FormItem', 'on-form-change', {
          tarketKeys: rCData,
          direction: direction,
          moveKeys: moveKeys
        });
      },
      moveAllTo (direction) {
        const lCData = this.$refs.left.$refs.table.cloneData;
        const rCData = this.$refs.right.$refs.table.cloneData;
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.getAllKeys(opposite);
        if (direction === 'right') {
          this.rightData = moveKeys.concat(rCData)
          this.leftData = [];
        }else{
          this.leftData = moveKeys.concat(lCData)
          this.rightData = [];
        }
        this.$emit('on-change', this.rightData,direction, moveKeys);
        this.dispatch('FormItem', 'on-form-change', {
            tarketKeys: this.rightData,
            direction: direction,
            moveKeys: moveKeys 
        });
      },
      getAlldata(){
        let data = {};
        data.leftData= this.$refs.left.$refs.table.cloneData;
        data.rightData= this.$refs.right.$refs.table.cloneData;
        return data;
      },
    },
    watch: {
      lData (val) {
        this.leftData = val;
      },
      rData (val) {
        this.rightData = val;
      },
    },
    mounted () {
      this.leftData = this.lData;
      this.rightData = this.rData;
    }
  };
</script>
