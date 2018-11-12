// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import Venus from '../src/index.js'
// import '../dist/h_ui.min.css'
// import Upload from '../dist/lib/Upload.js'
// import Button from '../dist/lib/Button.js'
// import hello_npm from 'venus_hello_npm'

Vue.use(Venus)
// Vue.component('h-upload',Upload)
// Vue.component('h-button',Button)

new Vue({
  el: '#app',
  name: 'Venus',
  router,
  render: h => h(App)
})