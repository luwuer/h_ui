<template>
    <div>
        <Button @click="visible = true">show1</Button>
        <Button @click="visible2 = true">show2</Button>
        <Button @click="visible3 = true">show3</Button>
        {{visible}}
        <h-drawer v-model="visible2" title="抽屉标题" :scrollable="true" width="270" placement="right" :mask-closable="false">
            <p slot="header">header</p>
            <p slot="close"><Button @on-click="visible2=false">删除</Button></p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容22</p>
        </h-drawer>
        <h-drawer v-model="visible3" placement="left" :mask="false">
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容22</p>
        </h-drawer>
        <div style="width: 500px;height:500px;position: relative;">
             <h-drawer v-model="visible" class-name="h-ui-123" :transfer="false" inner width="70"  title="抽屉标题1" :styles="styles" :mask-style="maskStyles" @on-close="handleClose" @on-visible-change="change">
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <Button @click="visible2 = true">show2</Button>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
            <p>一些内容</p>
        </h-drawer>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                visible: false,
                visible2: false,
                visible3: false,
                styles: {
                    height: 'calc(100% - 55px)',
                    paddingBottom: '53px',
                },
                maskStyles:{
                    backgroundColor: 'red'
                },
                ms: {
                    backgroundColor: 'rgba(255,0,255,0.5)'
                }
            };
        },
        methods: {
            handleClose () {
                this.$hMessage.info('关闭了');
            },
            change(e){
                this.$hMessage.info('change'+e);
            }
        }
    };
</script>

<style>
body{
    height: 2000px;
}
</style>