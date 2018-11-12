<template>
  <div>
    <h2>基本用法</h2>
    <p>需要配合 DropdownMenu 和 DropdownItem 两个组件来使用，并且给列表设置具名 slot 为 list</p>
    <h-dropdown @on-click="click" @on-visible-change="tog">
      <a href="javascript:void(0)">
        下拉菜单
        <h-icon name="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
          <h-dropdown-item>驴打滚</h-dropdown-item>
          <h-dropdown-item>炸酱面</h-dropdown-item>
          <h-dropdown-item disabled>豆汁儿</h-dropdown-item>
          <h-dropdown-item>冰糖葫芦</h-dropdown-item>
          <h-dropdown-item divided>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h-dropdown style="margin-left: 20px">
      <h-button type="primary">
          下拉菜单
          <h-icon name="unfold"></h-icon>
      </h-button>
      <h-dropdown-menu slot="list">
          <h-dropdown-item>驴打滚</h-dropdown-item>
          <h-dropdown-item>炸酱面</h-dropdown-item>
          <h-dropdown-item disabled>豆汁儿</h-dropdown-item>
          <h-dropdown-item>冰糖葫芦</h-dropdown-item>
          <h-dropdown-item divided>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h2>触发方式</h2>
    <p>通过设置属性 trigger 可以更改触发方式，可选项为 click 、 hover(默认) 或 custom(自定义)。<br>
    触发方式设置为 custom 自定义时，需手动设置 visible 属性来控制下拉框的显示。</p>
    <h-dropdown>
      <a href="javascript:void(0)">
        hover 触发
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
        <h-dropdown-item>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h-dropdown trigger="click" style="margin-left: 20px">
      <a href="javascript:void(0)">
        click 触发
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
        <h-dropdown-item>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h-dropdown trigger="custom" :visible="visible" style="margin-left: 20px">
      <a href="javascript:void(0)" @click="handleOpen">
        custom 触发
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <p>常用于各种自定义下拉内容的场景。</p>
        <div style="text-align: right;margin:10px;">
            <h-button type="primary" @click="handleClose">关闭</h-button>
        </div>
      </h-dropdown-menu>
    </h-dropdown>
    <h2>对齐方向</h2>
    <p>通过设置属性 placement 可以更改下拉菜单出现的方向</p>
    <h-dropdown  placement="bottom-start">
      <a href="javascript:void(0)">
        菜单左
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
        <h-dropdown-item>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h-dropdown style="margin-left:20px;">
      <a href="javascript:void(0)">
        菜单居中
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
        <h-dropdown-item>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h-dropdown  placement="bottom-end" style="margin-left:20px;">
      <a href="javascript:void(0)">
        菜单右
        <h-icon type="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
        <h-dropdown-item>北京烤鸭</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <h2>嵌套用法</h2>
    <p>下拉菜单可以进行嵌套实现级联的效果，嵌套时注意设置子集的展开方向</p>
    <h-dropdown>
      <a href="javascript:void(0)">
        北京小吃
        <h-icon name="unfold"></h-icon>
      </a>
      <h-dropdown-menu slot="list">
        <h-dropdown-item>驴打滚</h-dropdown-item>
        <h-dropdown-item>炸酱面</h-dropdown-item>
        <h-dropdown-item>豆汁儿</h-dropdown-item>
        <h-dropdown placement="right-start">
          <h-dropdown-item>
            北京烤鸭
            <h-icon name="enter"></h-icon>
          </h-dropdown-item>
          <h-dropdown-menu slot="list">
              <h-dropdown-item>挂炉烤鸭</h-dropdown-item>
              <h-dropdown-item>焖炉烤鸭</h-dropdown-item>
          </h-dropdown-menu>
        </h-dropdown>
        <h-dropdown-item>冰糖葫芦</h-dropdown-item>
      </h-dropdown-menu>
    </h-dropdown>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>  
</template>

<script>

export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    handleOpen () {
      this.visible = true;
    },
    handleClose () {
      this.visible = false;
    },
    click(v){
      console.log(v);
    },
    tog(e){
      console.log(e);
    }
  } 
}
</script>