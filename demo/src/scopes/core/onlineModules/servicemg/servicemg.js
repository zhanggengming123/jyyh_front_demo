// import {Vue, store, taMixins} from 'common/js/public-ant.js'// 引入公共文件
import {Vue, store, taMixins} from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块
import moduleStore from './store/store'
// 自己引入各种插件
import {
  userSelect,
  searchPanel,
  tagSelect,
  carefulDelete,
  radio,
  table,
  pagination,
  drawer,
  menu,
  datePicker,
  tabs,
  eTree,
  dropdown,
  tag,
  tableOperate,
  tooltip,
  divider,
  popconfirm,
  card,
  Switch,
  steps,
  select,
  transfer,
  upload,
  alert
} from '@yh/ta404-ui'

store.registerModule('online', moduleStore)

Vue.use(radio)
Vue.use(userSelect)
Vue.use(tagSelect)
Vue.use(carefulDelete)
Vue.use(table)
Vue.use(pagination)
Vue.use(drawer)
Vue.use(menu)
Vue.use(datePicker)
Vue.use(tabs)
Vue.use(eTree)
Vue.use(dropdown)
Vue.use(tag)
Vue.use(tableOperate)
Vue.use(tooltip)
Vue.use(divider)
Vue.use(popconfirm)
Vue.use(card)
Vue.use(Switch)
Vue.use(steps)
Vue.use(select)
Vue.use(transfer)
Vue.use(upload)
Vue.use(alert)
// 把组件化页面挂载到节点app上
window._Vue = new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
