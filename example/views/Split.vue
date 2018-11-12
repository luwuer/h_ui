<template>
  <div>
    <h1>左右分割</h1>
    {{split1}}
    <div class="demo-split">
        <h-split v-model="split1" min="100px" max="100px" @on-move-start="moveStart" @on-moving="move" @on-move-end="moveEnd">
            <div slot="left" class="demo-split-pane">
                左边面板
            </div>
            <div slot="right" class="demo-split-pane">
                右边面板
            </div>
        </h-split>
    </div>
    <h1>上下分割</h1>
    {{split2}}
    <div class="demo-split">
        <h-split v-model="split2" mode="vertical">
            <div slot="top" class="demo-split-pane">
                上边面板
            </div>
            <div slot="bottom" class="demo-split-pane">
                下边面板
            </div>
            <div slot="trigger">
                我是分割线
            </div>
        </h-split>
    </div>
    <h1>嵌套使用 #</h1>
    {{split3}} 横//竖 {{split4}}
    <div class="demo-split">
        <Split v-model="split3">
            <div slot="left" class="demo-split-pane no-padding">
                <Split v-model="split4" mode="vertical">
                    <div slot="top" class="demo-split-pane">
                        Top Pane
                    </div>
                    <div slot="bottom" class="demo-split-pane">
                        Bottom Pane
                    </div>
                </Split>
            </div>
            <div slot="right" class="demo-split-pane">
                Right Pane
            </div>
        </Split>
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<script>
    export default {
        name: 'split_pane_page',
        data () {
            return {
                offset: 0.6,
                offsetVertical: '250px',
                // split1: 0.5,
                split1: '200px',
                // split2: 0.5,
                split2: '100px',
                split3: 0.5,
                split4: 0.5
            }
        },
        methods: {
            handleMoving (e) {
                console.log(e.atMin, e.atMax)
            },
            moveStart () {
                console.log('开始拖拽');
            },
            move (e) {
                console.log('拖动中');
                console.log(e);
            },
            moveEnd () {
                console.log('拖拽结束');
            }
        }
    }
</script>
<style>
    .demo-split{
        height: 200px;
        border: 1px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
    .demo-split-pane.no-padding{
        height: 200px;
        padding: 0;
    }
</style>