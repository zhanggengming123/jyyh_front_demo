// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { store, taMixins, Vue } from 'common/js/public-ant-modules.js' // 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块

import {
  avatar,
  checkbox,
  divider,
  drawer,
  dropdown,
  menu,
  pageTool,
  pagination,
  popconfirm,
  radio,
  select,
  Switch,
  // table,
  tag,
  tagSelect,
  tooltip,
  tableOperate,
  notification,
  collapse,
  carefulDelete,
  popoverEx
} from '@yh/ta404-ui'

Vue.use(popoverEx)
Vue.use(collapse)
Vue.use(carefulDelete)
Vue.use(dropdown)
Vue.use(menu)
Vue.use(tagSelect)
Vue.use(pageTool)
Vue.use(avatar)
// Vue.use(table)
Vue.use(drawer)
Vue.use(select)
Vue.use(radio)
Vue.use(pagination)
Vue.use(tag)
Vue.use(tooltip)
Vue.use(divider)
Vue.use(popconfirm)
Vue.use(Switch)
Vue.use(checkbox)
Vue.use(tableOperate)
Vue.use(notification)

Vue.prototype.$notification = notification

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
