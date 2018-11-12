<template>
	<div>
	    <h1>基本用法</h1>
      <h-menu mode="horizontal" :theme="theme1" active-name="1" @on-select="s" @on-open-change="openChange">
        <h-menu-item name="1">
            <h-icon name="accessory"></h-icon>
            内容管理
        </h-menu-item>
        <h-menu-item name="2">
            <h-icon name="activity"></h-icon>
            用户管理
        </h-menu-item>
        <h-submenu name="3">
            <template slot="title">
                <h-icon name="activity"></h-icon>
                统计分析
            </template>
            <h-menu-group title="使用">
                <h-menu-item name="3-1">新增和启动</h-menu-item>
                <h-menu-item name="3-2">活跃分析</h-menu-item>
                <h-menu-item name="3-3">时段分析</h-menu-item>
            </h-menu-group>
            <h-menu-group title="留存">
                <h-menu-item name="3-4">用户留存</h-menu-item>
                <h-menu-item name="3-5">流失用户</h-menu-item>
            </h-menu-group>
        </h-submenu>
        <h-menu-item name="4">
          <h-icon name="activity"></h-icon>
          综合设置
        </h-menu-item>
      </h-menu>

      <br>
      <p>切换主题</p>
      <h-radio-group v-model="theme1">
          <h-radio label="light"></h-radio>
          <h-radio label="dark"></h-radio>
          <h-radio label="primary"></h-radio>
      </h-radio-group>
      <br>
      <br>
      <h1>侧栏导航</h1>
      <p>垂直导航菜单，可以内嵌子菜单<br>
      设置 active-name 可以选中指定的菜单，设置 open-names 可以展开指定的子菜单。<br>
      设置属性 accordion 可以开启手风琴模式，每次只能展开一个子菜单。<br>
      通过设置属性 theme 为 light、dark 可以选择主题，侧栏菜单不支持 primary 主题。</p>
      <br>
      <h-row>
      <h-col span="8">
          <h-menu  mode="vertical" :theme="theme2"  active-name="2" :open-names="openName" :accordion="false" @on-open-change="openChange" :width="120" @on-select="s">
          <h-submenu name="1">
              <template slot="title">
                  <h-icon name="ios-paper"></h-icon>
                  内容管理
              </template>
              <h-menu-item name="1-1">文章管理</h-menu-item>
              <h-menu-item name="1-2">评论管理</h-menu-item>
              <h-menu-item name="1-3">举报管理</h-menu-item>
          </h-submenu>
          <h-submenu name="2">
              <template slot="title">
                  <h-icon name="ios-people"></h-icon>
                  用户管理
              </template>
              <h-menu-item name="2-1">新增用户</h-menu-item>
              <h-menu-item name="2-2">活跃用户</h-menu-item>
          </h-submenu>
          <h-submenu name="3">
              <template slot="title">
                  <h-icon name="stats-bars"></h-icon>
                  统计分析
              </template>
              <h-menu-group title="使用">
                  <h-menu-item name="3-1">新增和启动</h-menu-item>
                  <h-menu-item name="3-2">活跃分析</h-menu-item>
                  <h-menu-item name="3-3">时段分析</h-menu-item>
              </h-menu-group>
              <h-menu-group title="留存">
                  <h-menu-item name="3-4">用户留存</h-menu-item>
                  <h-menu-item name="3-5">流失用户</h-menu-item>
              </h-menu-group>
          </h-submenu>
          </h-menu>
          <Button @on-click="setOpen">动态设置openName</Button>
      </h-col>
      <h-col span="8">
          <h-menu :theme="theme2" active-name="1-2" :open-names="['1']">
              <h-submenu name="1">
                  <template slot="title">
                      <h-icon name="ios-paper"></h-icon>
                      内容管理
                  </template>
                  <h-menu-item name="1-1">文章管理</h-menu-item>
                  <h-menu-item name="1-2">评论管理</h-menu-item>
                  <!-- <h-menu-item name="1-3"> -->
                  <h-submenu name="1-3">
                  <template slot="title">
                      <h-icon name="ios-paper"></h-icon>
                      举报管理
                  </template> 
                  <h-menu-item name="1-3-1">举报管理1</h-menu-item>
                  <h-menu-item name="1-3-2">举报管理2</h-menu-item>
                </h-submenu>
                  <!-- </h-menu-item> -->
              </h-submenu>
              <h-submenu name="2">
                  <template slot="title">
                      <h-icon name="ios-people"></h-icon>
                      用户管理
                  </template>
                  <h-menu-item name="2-1">新增用户</h-menu-item>
                  <h-menu-item name="2-2">活跃用户</h-menu-item>
              </h-submenu>
              <h-submenu name="3">
                  <template slot="title">
                      <h-icon name="stats-bars"></h-icon>
                      统计分析
                  </template>
                  <h-menu-group title="使用">
                      <h-menu-item name="3-1">新增和启动</h-menu-item>
                      <h-menu-item name="3-2">活跃分析</h-menu-item>
                      <h-menu-item name="3-3">时段分析</h-menu-item>
                  </h-menu-group>
                  <h-menu-group title="留存">
                      <h-menu-item name="3-4">用户留存</h-menu-item>
                      <h-menu-item name="3-5">流失用户</h-menu-item>
                  </h-menu-group>
              </h-submenu>
          </h-menu>
      </h-col>
      <h-col span="8">
          <h-menu :theme="theme2" :open-names="['1']" accordion>
              <h-submenu name="1">
                  <template slot="title">
                      <h-icon name="ios-paper"></h-icon>
                      内容管理
                  </template>
                  <h-menu-item name="1-1">文章管理</h-menu-item>
                  <h-menu-item name="1-2">评论管理</h-menu-item>
                  <h-menu-item name="1-3">举报管理</h-menu-item>
              </h-submenu>
              <h-submenu name="2">
                  <template slot="title">
                      <h-icon name="ios-people"></h-icon>
                      用户管理
                  </template>
                  <h-menu-item name="2-1">新增用户</h-menu-item>
                  <h-menu-item name="2-2">活跃用户</h-menu-item>
              </h-submenu>
              <h-submenu name="3">
                  <template slot="title">
                      <h-icon name="stats-bars"></h-icon>
                      统计分析
                  </template>
                  <h-menu-group title="使用">
                      <h-menu-item name="3-1">新增和启动</h-menu-item>
                      <h-menu-item name="3-2">活跃分析</h-menu-item>
                      <h-menu-item name="3-3">时段分析</h-menu-item>
                  </h-menu-group>
                  <h-menu-group title="留存">
                      <h-menu-item name="3-4">用户留存</h-menu-item>
                      <h-menu-item name="3-5">流失用户</h-menu-item>
                  </h-menu-group>
              </h-submenu>
          </h-menu>
      </h-col>
      </h-row>
      <br>
      <p>切换主题</p>
      <h-radio-group v-model="theme2">
      <h-radio label="light"></h-radio>
      <h-radio label="dark"></h-radio>
      </h-radio-group>
      <br>
      <br>
      <h1>分组</h1>
      <p>
      使用 Menu-group 组件进行分组，注意：<br>
      Menu-group 只能用在 Menu 和 Submenu 内。<br>
      Submenu 只能用在 Menu 内，不能用在 Menu-group 和 Menu-item 内。
      </p>
      <h-menu :theme="theme3" active-name="1">
          <h-menu-group title="内容管理">
              <h-menu-item name="1">
                  <h-icon name="document"></h-icon>
                  文章管理
              </h-menu-item>
              <h-menu-item name="2">
                  <h-icon name="feedback"></h-icon>
                  评论管理
              </h-menu-item>
          </h-menu-group>
          <h-menu-group title="统计分析">
              <h-menu-item name="3">
                  <h-icon name="document"></h-icon>
                  用户留存
              </h-menu-item>
              <h-menu-item name="4">
                  <h-icon name="feedback"></h-icon>
                  流失用户
              </h-menu-item>
          </h-menu-group>
      </h-menu>
      <br>
      <p>切换主题</p>
      <h-radio-group v-model="theme3">
          <h-radio label="light"></h-radio>
          <h-radio label="dark"></h-radio>
      </h-radio-group>
      <br>
      <h-menu theme="light" :open-names="['1']" mode="horizontal">
          <h-submenu name="1">
              <template slot="title">
                  <h-icon name="computer"></h-icon>
                  <span slot="title">内容管理</span>
              </template>
              <h-menu-item name="1-1">文章管理</h-menu-item>
              <h-menu-item name="1-2">评论管理</h-menu-item>
              <h-menu-item name="1-3-3">举报管理</h-menu-item>
          </h-submenu>
          <h-submenu name="2">
              <template slot="title">
                  <h-icon name="computer"></h-icon>
                  <span slot="title">用户管理</span>
              </template>
              <h-menu-item name="2-1">新增用户</h-menu-item>
              <h-menu-item name="2-2">活跃用户</h-menu-item>
          </h-submenu>
          <h-submenu name="3">
              <template slot="title">
                  <h-icon name="computer"></h-icon>
                  <span slot="title">统计分析</span>
              </template>
              <h-menu-group title="使用">
                  <h-menu-item name="3-1">新增和启动</h-menu-item>
                  <h-menu-item name="3-2">活跃分析</h-menu-item>
                  <h-menu-item name="3-3">时段分析</h-menu-item>
              </h-menu-group>
              <h-menu-group title="留存">
                  <h-menu-item name="3-4">用户留存</h-menu-item>
                  <h-menu-item name="3-5">流失用户</h-menu-item>
              </h-menu-group>
          </h-submenu>
      </h-menu>
      <br>
      <h2>侧边栏可伸缩时【mode:vertical && collapse:true】</h2>
      <h-radio-group v-model="isCollapse">
          <h-radio label="false">展开</h-radio>
          <h-radio label="true">收缩</h-radio>
      </h-radio-group>
      <h-row>
          <h-col span='12'>
              <h-menu theme="dark" vertiSide shrinkClose active-name="1-2" :open-names="['1']" :collapse="isCollapse ==='true'" @on-open-change="openChange" @on-select="s">
                  <h-submenu name="1">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">内容管理</span>
                      </template>
                      <h-menu-item name="1-1">文章管理</h-menu-item>
                      <h-menu-item name="1-2">评论管理</h-menu-item>
                      <h-submenu name="1-3" showSlide>
                          <template slot="title">
                              <h-icon name="computer"></h-icon>
                              <span slot="title">举报管理</span>
                          </template>
                          <h-menu-item name="1-3-1">文章管理11</h-menu-item>
                          <h-menu-item name="1-3-2">评论管理22</h-menu-item>
                          <h-menu-item name="1-3-3">举报管理33</h-menu-item>
                      </h-submenu>
                  </h-submenu>
                  <h-submenu name="2">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">用户管理</span>
                      </template>
                      <h-menu-item name="2-1">新增用户</h-menu-item>
                      <h-menu-item name="2-2">活跃用户</h-menu-item>
                  </h-submenu>
                  <h-submenu name="3">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">统计分析</span>
                      </template>
                      <h-menu-group title="使用">
                          <h-menu-item name="3-1">新增和启动</h-menu-item>
                          <h-menu-item name="3-2">活跃分析</h-menu-item>
                          <h-menu-item name="3-3">时段分析</h-menu-item>
                      </h-menu-group>
                      <h-menu-group title="留存">
                          <h-menu-item name="3-4">用户留存</h-menu-item>
                          <h-menu-item name="3-5">流失用户</h-menu-item>
                      </h-menu-group>
                  </h-submenu>
              </h-menu>
          </h-col>
          <h-col span='12'>
              <h-menu theme="light" active-name="1-2" :collapse="isCollapse ==='true'" ref="side_menu">
                  <h-submenu name="1">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">内容管理</span>
                      </template>
                      <h-menu-item name="1-1">文章管理</h-menu-item>
                      <h-menu-item name="1-2">评论管理</h-menu-item>
                      <h-submenu name="1-3">
                          <template slot="title">
                              <h-icon name="computer"></h-icon>
                              <span slot="title">举报管理</span>
                          </template>
                          <h-menu-item name="1-3-1">文章管理11</h-menu-item>
                          <h-menu-item name="1-3-2">评论管理22</h-menu-item>
                          <h-menu-item name="1-3-3">举报管理33</h-menu-item>
                      </h-submenu>
                  </h-submenu>
                  <h-submenu name="2">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">用户管理</span>
                      </template>
                      <h-menu-item name="2-1">新增用户</h-menu-item>
                      <h-menu-item name="2-2">活跃用户</h-menu-item>
                  </h-submenu>
                  <h-submenu name="3">
                      <template slot="title">
                          <h-icon name="computer"></h-icon>
                          <span slot="title">统计分析</span>
                      </template>
                      <h-menu-group title="使用">
                          <h-menu-item name="3-1">新增和启动</h-menu-item>
                          <h-menu-item name="3-2">活跃分析</h-menu-item>
                          <h-menu-item name="3-3">时段分析</h-menu-item>
                      </h-menu-group>
                      <h-menu-group title="留存">
                          <h-menu-item name="3-4">用户留存</h-menu-item>
                          <h-menu-item name="3-5">流失用户</h-menu-item>
                      </h-menu-group>
                  </h-submenu>
              </h-menu>
          </h-col>
      </h-row>

      <h-button type="primary" @click="activetest" style="margin-top: 18px">激活</h-button>
      <h-menu mode="horizontal" :theme="theme1">
        <h-menu-item name="1">
            <h-icon name="ios-paper"></h-icon>
            内容管理
          </h-menu-item>
          <h-menu-item name="2">
            <h-icon name="ios-people"></h-icon>
            用户管理
          </h-menu-item>
        <h-submenu name="3">
          <template slot="title">
            <h-icon name="stats-bars"></h-icon>
              统计分析
          </template>
            <h-menu-group title="使用">
                <h-menu-item name="5-1">新增和启动</h-menu-item>
                <h-menu-item name="5-2">活跃分析</h-menu-item>
                <h-menu-item name="5-3">时段分析</h-menu-item>
            </h-menu-group>
            <h-menu-group title="留存">
                <h-menu-item name="5-4">用户留存</h-menu-item>
                <h-menu-item name="5-5">流失用户</h-menu-item>
            </h-menu-group>
          </h-submenu>
      </h-menu>
      <h1>测试</h1>
      <h-menu mode="horizontal" :theme="theme1" :active-name="csName" ref="csMenu">
        <h-menu-item v-for="(item,i) in cdata " :name="item.name" :key="item.name+i">
          <h-icon name="ios-paper"></h-icon>
          {{item.text}}
        </h-menu-item>
      </h-menu>
      <!-- <h-button @click="addItem"> 添加cdata数据内容4管理</h-button> -->
      <h-button @click="update"> 调用updateActiveName</h-button>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	</div>
</template>
<script>
var cData = [{
    name:'name0',
    text:'内容0管理'
  },{
    name:'name1',
    text:'内容1管理'
  },{
    name:'name2',
    text:'内容2管理'
  },{
    name:'name3',
    text:'内容3管理'
  }]
export default {
  data(){
    return {
      theme1: 'light',
      theme2: 'light',
      theme3: 'light',
      isCollapse: 'true',
      cdata:cData,
      csName:'',
      openName:[],
    }
  },
  methods: {
    s (s) {
      console.log(s)
    },
    openChange(s){
        console.log(s)
    },
    activetest() {
      // this.active = ["2"];
        this.$nextTick(function() {
          this.$refs.side_menu.updateOpened();
          // this.$refs.side_menu.updateActiveName();
        })
      // this.handleSelect(this.active);
    },
    addItem(){
      this.cdata[this.cdata.length-1].text = "我是新标题";
    },
    update(){
      this.$nextTick(()=>{
        this.csName="name1";
        // console.log();
        // this.$refs.csMenu.updateActiveName();
      });
    },
    setOpen(){
        this.openName = ['1','3'];
    }
  }
}
</script>