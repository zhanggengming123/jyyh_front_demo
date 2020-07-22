// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { store, taMixins, Vue } from 'common/js/public-ant-modules.js' // 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块
import {
  popoverEx,
  table,
  tooltip,
  divider,
  radio,
  tag,
  select,
  pagination,
  tabs,
  datePicker,
  tagSelect,
  labelCon,
  tableOperate
} from '@yh/ta404-ui'

Vue.use(popoverEx)
Vue.use(tagSelect)
Vue.use(pagination)
Vue.use(tabs)
Vue.use(table)
Vue.use(tableOperate)
Vue.use(tooltip)
Vue.use(divider)
Vue.use(tag)
Vue.use(radio)
Vue.use(select)
Vue.use(datePicker)
Vue.use(labelCon)

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
