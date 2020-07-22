import '@/common/js/util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
import './js/module' // 引入需要的组件
import app from './login.vue'
import store from './store/loginStore'
window.faceConfig = faceConfig
new Vue({
  store,
  render: h => h(app)
}).$mount('#app')
