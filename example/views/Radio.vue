<template>
	<div>
		<h2>单独使用</h2>
        <h-radio @on-click="click" v-model="single1" size="large" true-value="1" false-value="0">Radio</h-radio>s
        <h-radio @on-click="click" v-model="single">Radio</h-radio>
		<h-radio @on-click="click" v-model="single" size="small">Radio</h-radio>
        {{single1}}
		{{single}}
		<h2>组合使用</h2>
		<h-radio-group v-model="phone" @on-click="click">
      <h-radio label="apple" size="large">
        <h-Icon name="clock"></h-Icon>
        <span>Apple</span>
      </h-radio>
      <h-radio label="android">
        <h-Icon name="clock"></h-Icon>
        <span>Android</span>
      </h-radio>
      <h-radio label="windows" size="small">
        <h-Icon name="clock"></h-Icon>
        <span>Windows</span>
      </h-radio>
    </h-radio-group><br>
    <h-radio-group v-model="animal">
      <h-radio label="金斑蝶" :disabled="status"></h-radio>
      <h-radio label="爪哇犀牛" :disabled="status"></h-radio>
      <h-radio label="印度黑羚" :disabled="status"></h-radio>
    </h-radio-group>
    {{animal}}
    <h-button @click="changeStatus">改变disabled状态</h-button>
    <h2>不可用</h2>
    <h-radio v-model="disabledSingle" disabled>h-radio</h-radio><br>
    <h-radio-group v-model="disabledGroup">
        <h-radio label="金斑蝶" disabled></h-radio>
        <h-radio label="爪哇犀牛"></h-radio>
        <h-radio label="印度黑羚"></h-radio>
    </h-radio-group>
    <h2>垂直</h2>
    <p>设置属性 vertical 可以垂直显示，按钮样式下无效。</p>
    <h-radio-group v-model="vertical" vertical>
        <h-radio label="apple">
            <h-icon name="clock"></h-icon>
            <span>Apple</span>
        </h-radio>
        <h-radio label="android">
            <h-icon name="clock"></h-icon>
            <span>Android</span>
        </h-radio>
        <h-radio label="windows">
            <h-icon name="clock"></h-icon>
            <span>Windows</span>
        </h-radio>
    </h-radio-group>
    <h2>按钮样式</h2>
    <p>通过设置属性size为large或small将按钮样式设置为大和小尺寸，不设置为默认(中)尺寸。</p>
    <h-radio-group v-model="button1" type="button">
        <h-radio label="北京"></h-radio>
        <h-radio label="上海"></h-radio>
        <h-radio label="深圳"></h-radio>
        <h-radio label="杭州"></h-radio>
    </h-radio-group>
    {{button1}}
    <h-radio-group v-model="button2" type="button">
        <h-radio label="北京"></h-radio>
        <h-radio label="上海" disabled></h-radio>
        <h-radio label="深圳"></h-radio>
        <h-radio label="杭州"></h-radio>
    </h-radio-group>
    {{button2}}
    <h-radio-group v-model="button3" type="button">
        <h-radio label="北京" disabled></h-radio>
        <h-radio label="上海" disabled></h-radio>
        <h-radio label="深圳" disabled></h-radio>
        <h-radio label="杭州" disabled></h-radio>
    </h-radio-group>
    {{button3}}
    <h2>尺寸</h2>
    <h-radio-group v-model="button4" type="button" size="large">
        <h-radio label="北京"></h-radio>
        <h-radio label="上海"></h-radio>
        <h-radio label="深圳"></h-radio>
        <h-radio label="杭州"></h-radio>
    </h-radio-group>
    {{button4}}
    <h-radio-group v-model="button5" type="button">
        <h-radio label="北京"></h-radio>
        <h-radio label="上海"></h-radio>
        <h-radio label="深圳"></h-radio>
        <h-radio label="杭州"></h-radio>
    </h-radio-group>
    {{button5}}
    <h-radio-group v-model="button6" type="button" size="small">
        <h-radio label="北京"></h-radio>
        <h-radio label="上海"></h-radio>
        <h-radio label="深圳"></h-radio>
        <h-radio label="杭州"></h-radio>
    </h-radio-group>
    {{button6}}
	</div>
</template>
<script>
	export default{
		name:'radio',
		data(){
			return {
                status:true,
                single1: 0,
				single: false,
				phone: 'apple',
                animal: '爪哇犀牛',
                disabledSingle: true,
                disabledGroup: '爪哇犀牛',	
                vertical: 'apple',
                button1: '北京',
                button2: '北京',
                button3: '北京',
                button4: '北京',
                button5: '北京',
                button6: '北京'
			}
		},
        methods:{
            changeStatus(){
                this.status = !this.status
            },
            click(){
                console.log('我被点击了')
            }
        }
	}
</script>
<style>
	
</style>