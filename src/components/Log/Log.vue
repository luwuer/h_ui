<template>
	<div :class="wrapClass">
		<div :class="`${prefixCls}-content`" :style="styleCls" ref="content">
			<div v-for="(item,inx) in showLogs" :key="inx" :class="itemClass(item)" v-html="itemContent(item)"></div>
		</div>
		<div :class="footerClass" v-if="isClear">
			<slot name="footer">
				<Button @on-click="handlerClear">{{btnText}}</Button>
			</slot>
		</div>
	</div>
</template>
<script>
  import { oneOf,deepCopy } from '../../util/tools';
  import Locale from '../../mixins/locale';
  import Button from '../Button/Button.vue';
  const prefixCls = 'h-log'
	export default{
		name:'Log',
		components:{Button},
		mixins: [Locale],
		data(){
			return{
				prefixCls:prefixCls,
				showLogs:[],
			}
		},
		props:{
			logs:Array,
			maxSize:{
				type:[Number, String],
				default:10000
			},
			itemHieght:{
				type:[Number, String],
				default:40
			},
			height:{
				type:[Number, String],
				default:400
			},
			isClear:{
				type:Boolean,
				default:true,
			}
		},
		computed:{
			wrapClass(){
				return[
					`${prefixCls}`,
					{
					}
				]
			},
			styleCls(){
				let style={}
					style.height = this.height+'px';
				return style
			},
			footerClass(){
				return[
					`${prefixCls}-footer`,
					{
					}
				]
			},
			btnText(){
				return this.t('i.log.clear');
			}
		},
		methods:{
			iconClick(e){
				this.$emit("on-click",e)
			},
			handlerClear(){
				this.showLogs=[];
			},
			itemClass(item){
				return[
					`${prefixCls}-item`,
					{
						[`${prefixCls}-warn`]:item.type=='w'?true:false,
						[`${prefixCls}-error`]:item.type=='e'?true:false,
						[`${prefixCls}-debugger`]:item.type=='d'?true:false,
					}
				]
			},
			itemContent(item){
				let pre = null;
				switch (item.type) {
					case 'w':
					  pre='【WARN】';
					  break;
					case 'e':
					  pre='【ERROR】';
					  break;
					case 'd':
					  pre='【DEBUGGER】';
					  break;
					default:
					  pre='【INFO】';
				}
				return pre+' '+item.str;
			}
		},
		watch:{
			logs:{
				deep:true,
				immediate:true,
				handler(val){
					if(val.length>0){
						this.showLogs=this.showLogs.concat(deepCopy(val));
					}
				}
			},
			showLogs(val){
				if(val.length>this.maxSize){
					let num = Math.ceil(this.maxSize/4)
					this.showLogs.splice(0,num);
				}
				this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
			}
		}
	}
</script>
