// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { Vue, store, taMixins } from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块
import {
  popoverEx,
  userSelect,
  tagSelect,
  table,
  drawer,
  select,
  tooltip,
  tableEdit,
  popconfirm,
  tabs,
  datePicker,
  divider,
  pagination,
  timePicker,
  radio,
  labelCon,
  tag
} from '@yh/ta404-ui'
import tableOperate from '@yh/ta404-ui/es/table-operate'

Vue.use(popoverEx)
Vue.use(userSelect)
Vue.use(tagSelect)
Vue.use(table)
Vue.use(drawer)
Vue.use(select)
Vue.use(tooltip)
Vue.use(tableEdit)
Vue.use(popconfirm)
Vue.use(tabs)
Vue.use(datePicker)
Vue.use(divider)
Vue.use(pagination)
Vue.use(timePicker)
Vue.use(radio)
Vue.use(labelCon)
Vue.use(tag)
Vue.use(tableOperate)

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
