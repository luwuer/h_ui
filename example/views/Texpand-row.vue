<template>
  <div class="expand-row">
  <!-- {{row}} -->
    <div>
      <h-row class="expand-row1">
        <h-col span="8">
          <span class="expand-key">职业：</span>
          <span class="expand-value">{{ row.job }}</span>
        </h-col>
        <h-col span="8">
          <span class="expand-key">兴趣：</span>
          <span class="expand-value">{{ row.interest }}</span>
        </h-col>
        <h-col span="8">
          <span class="expand-key">生日：</span>
          <span class="expand-value">{{ row.birthday }}</span>
        </h-col>
      </h-row>
      <h-row>
        <h-col span="8">
          <h-table :columns="col" :data="data1"></h-table>
          <Button @click="add">加一行</Button>
          <!-- <span class="expand-key">最喜欢的书：</span> -->
          <span class="expand-value">{{ row.book }}</span>
        </h-col>
        <h-col span="8">
          <span class="expand-key">最喜欢的电影：</span>
          <span class="expand-value">{{ row.movie }}</span>
        </h-col>
        <h-col span="8">
          <span class="expand-key">最喜欢的音乐：</span>
          <span class="expand-value">{{ row.music }}</span>
        </h-col>
      </h-row>
    </div>
  </div>  
</template>

<script>

export default {
  name: 'home',
  props: {
    row: Object,
  },
  data() {
    return {
      col:[{key:'name',title:'姓名'},
        {key:'name1',title:'姓名1'},
        {key:'name2',title:'姓名2'},
        {key:'name3',title:'姓名3'},
        {
          title:'姓名3',
          render: (h, params) => {
            return h('div', [
              h('h-button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'click': () => {
                    this.add();
                  }
                }
              }, '查看')
            ]);
          }
        },
      ],
      data1:[
        {name:'0',name1:'1',name2:'2',name3:'3'},
      ]
    }
  },
  methods:{
    add(){
      this.data1.push({name:'2',name1:'3',name2:'4',name3:'5'})
      this.row.book = '123';
    }
  },
  watch:{
    fixed(val){
      console.log('val'+val);
    }
  } 
}
</script>
<style type="text/css">
.expand-row{
  width: 400px;  
  height: 300px;
}

</style>