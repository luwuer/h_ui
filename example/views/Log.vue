<template>
	<div>
		<Button @on-click="clear">外部清屏</Button>
		<h-log :logs="data" maxSize="10000" ref="log"></h-log>
		<h1>隐藏footer</h1>
		<h-log :logs="data" maxSize="100" :isClear="false" :height="200"></h-log>
		<h1>自定义footer</h1>
		<h-log :logs="data" maxSize="1000">
			<p slot="footer">我是footer</p>
		</h-log>
	</div>
</template>
<script>
let timer;	
	export default{
		name:"Log",
		data(){
			return{
				data:[
				],
				index:0
			}
		},
		methods:{
			pushData(){
				// let arr = [{str:'xxx111111111',type:"e"},
				// 	{str:'xxx22222222',type:"i"},
				// 	{str:'xxx3333333333',type:"w"},
				// 	{str:'xxx44444444444',type:"d"}];
				let item = ['e','d','w','i'];
				let obj={};
				obj.str = this.index;
				obj.type = item[Math.floor(Math.random()*item.length)];;
				this.data = [];
				this.data.push(obj);
				this.index++;
				if(this.index>1100){
					clearInterval(timer);
				}
			},
			clear(){
				this.$refs.log.handlerClear();
			}
		},
		mounted(){
			timer = setInterval(()=>{this.pushData()},5);
		}
	}
</script>