<template>
  <div>
    <h1>基础用法</h1>
    {{value1}}
    <h-input-number :max="100" :min="10" v-model="value1" style="width:200px"></h-input-number>
    <h-input-number :max="10" :min="3" :step="1.2" v-model="value2"></h-input-number><br>
    <br>
    <h-input-number :max="10" :min="1" :step="1.2" v-model="value2" disabled></h-input-number>
    <h-input-number :max="10" :min="1" :step="1.2" v-model="value2" readonly></h-input-number>
    <h-input-number :max="10" :min="1" :step="1.2" v-model="value2" :editable="false"></h-input-number>
    <br>
    <br>
    <h-input-number v-model="value3" size="small"></h-input-number>
    <h-input-number v-model="value4"></h-input-number>
    <h-input-number v-model="value5" size="large"></h-input-number>
    <br>
    <br>
    <h-input-number v-model="value6" :disabled="disabled"></h-input-number>
    <h-button type="primary" @click="disabled = !disabled">Toggle Disabled</h-button>
  </div>
</template>

<script>

export default {
  name: 'InputNum',
  data() {
    return {
      value1: 0,
      value2: 0,
      value3: 3,
      value4: 4,
      value5: 5,
      disabled: true,
      value6: 1
    }
  } 
}
</script>