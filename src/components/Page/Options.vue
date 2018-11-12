<template>
  <div v-if="showSizer || showElevator||showCustom" :class="optsClasses">
    <div v-if="showSizer" :class="sizerClasses">
      <h-select v-model="currentPageSize" :size="size" :placement="placement" @on-change="changeSize" :clearable="false">
        <h-option v-for="item in pageSizeOpts" :key="item" :value="item" style="text-align:center;">{{ item }} {{ t('i.page.page') }}</h-option>
      </h-select>
    </div>
    <div v-if="showCustom&&!showSizer" :class="ElevatorClasses">
      <input v-model="currentPageSize" @keyup.enter="changeCustom">
      {{curSize}}条/每页
    </div>
    <div v-if="showElevator" :class="ElevatorClasses">
      {{ t('i.page.goto') }}
      <input v-if="!isBlur" type="text" :value="_current" @keyup.enter="changePage">
      <input v-if="isBlur" type="text" :value="_current" @blur="changePage">
      {{ t('i.page.p') }}
    </div>
  </div>
</template>
<script>
    import hSelect from '../../components/Select/Select.vue';
    import hOption from '../../components/Select/Option.vue';
    import Locale from '../../mixins/locale';

    const prefixCls = 'h-page';

    function isValueNumber (value) {
        return (/^[1-9][0-9]*$/).test(value + '');
    }

    export default {
        name: 'PageOption',
        mixins: [ Locale ],
        components: { hSelect, hOption },
        props: {
            pageSizeOpts: Array,
            showSizer: Boolean,
            showElevator: Boolean,
            current: Number,
            _current: Number,
            pageSize: Number,
            allPages: Number,
            isSmall: Boolean,
            placement: String,
            isBlur:Boolean,
            showCustom:Boolean,
        },
        data () {
            return {
                currentPageSize: this.pageSize,
                curSize:this.pageSize
            };
        },
        watch: {
            pageSize (val) {
                this.currentPageSize = val;
            },
        },
        computed: {
            size () {
                return this.isSmall ? 'small' : 'default';
            },
            optsClasses () {
                return [
                    `${prefixCls}-options`
                ];
            },
            sizerClasses () {
                return [
                    `${prefixCls}-options-sizer`
                ];
            },
            ElevatorClasses () {
                return [
                    `${prefixCls}-options-elevator`
                ];
            }
        },
        methods: {
            changeSize () {
                this.$emit('on-size', Number(this.currentPageSize));
            },
            changeCustom(){
                if(isValueNumber(this.currentPageSize)){
                    this.curSize = this.currentPageSize;
                    this.changeSize();
                }
            },
            changePage (event) {
                let val = event.target.value.trim();
                let page = 0;

                if (isValueNumber(val)) {
                    val = Number(val);
                    if (val != this.current) {
                        const allPages = this.allPages;

                        if (val > allPages) {
                            page = allPages;
                        } else {
                            page = val;
                        }
                    }
                } else {
                    page = 1;
                }

                if (page) {
                    this.$emit('on-page', page);
                    event.target.value = page;
                }
            }
        }
    };
</script>