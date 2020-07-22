// import {Vue, store, taMixins} from 'common/js/public-ant.js'// 引入公共文件
import { Vue, store, taMixins } from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块

import {
  tagSelect,
  table,
  tableOperate,
  drawer,
  select,
  checkbox,
  pagination,
  divider,
  tooltip,
  popconfirm,
  pdfViewer,
  cascader,
  datePicker,
  inputNumber,
  radio,
  Switch,
  timePicker,
  treeSelect,
} from '@yh/ta404-ui'

Vue.use(tagSelect)
Vue.use(table)
Vue.use(tableOperate)
Vue.use(drawer)
Vue.use(select)
Vue.use(checkbox)
Vue.use(pagination)
Vue.use(divider)
Vue.use(tooltip)
Vue.use(popconfirm)
Vue.use(pdfViewer)
Vue.use(cascader)
Vue.use(datePicker)
Vue.use(inputNumber)
Vue.use(radio)
Vue.use(Switch)
Vue.use(timePicker)
Vue.use(treeSelect)

Vue.directive('disabled', {
  bind: function (el, binding, vnode) {
    console.log(el) // el代表当前绑定的元素
    console.log(vnode.data)
  }
})

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
