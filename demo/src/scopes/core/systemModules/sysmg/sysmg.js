// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { Vue, store, taMixins } from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块

import {
  alert,
  breadcrumb,
  popoverEx,
  userSelect,
  tagSelect,
  searchPanel,
  dropdown,
  menu,
  table,
  pagination,
  select,
  divider,
  popconfirm,
  drawer,
  Switch,
  tag,
  tooltip,
  card,
  tableEdit,
  inputNumber,
  radio,
  collapse,
  colorPicker,
  checkbox,
  tabs,
  carefulDelete,
  tableOperate,
  datePicker,
  timePicker,
  labelCon
} from '@yh/ta404-ui'

Vue.use(popoverEx)
Vue.use(userSelect)
Vue.use(searchPanel)
Vue.use(tagSelect)
Vue.use(dropdown)
Vue.use(menu)
Vue.use(table)
Vue.use(pagination)
Vue.use(drawer)
Vue.use(select)
Vue.use(divider)
Vue.use(popconfirm)
Vue.use(tableOperate)
Vue.use(Switch)
Vue.use(tag)
Vue.use(tooltip)
Vue.use(card)
Vue.use(tableEdit)
Vue.use(inputNumber)
Vue.use(radio)
Vue.use(collapse)
Vue.use(colorPicker)
Vue.use(checkbox)
Vue.use(tabs)
Vue.use(carefulDelete)
Vue.use(datePicker)
Vue.use(breadcrumb)
Vue.use(alert)
Vue.use(timePicker)
Vue.use(labelCon)

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
