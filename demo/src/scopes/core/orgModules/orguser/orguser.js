// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { store, taMixins, Vue } from '@/common/js/public-ant-modules.js' // 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块
import {
  table,
  tooltip,
  divider,
  popconfirm,
  drawer,
  radio,
  Switch,
  cascader,
  autoComplete,
  tag,
  select,
  eTree,
  checkbox,
  menu,
  pagination,
  dropdown,
  card,
  breadcrumb,
  tabs,
  alert,
  collapse,
  datePicker,
  tableEdit,
  popoverEx,
  userSelect,
  searchPanel,
  userInput,
  tagSelect,
  carefulDelete,
  tableOperate
} from '@yh/ta404-ui'
// 自己引入各种插件
import VueCookies from 'vue-cookies'

Vue.use(popoverEx)
Vue.use(userSelect)
Vue.use(searchPanel)
Vue.use(tableEdit)
Vue.use(userInput)
Vue.use(tagSelect)
Vue.use(carefulDelete)
Vue.use(pagination)
Vue.use(tabs)
Vue.use(alert)
Vue.use(dropdown)
Vue.use(card)
Vue.use(menu)
Vue.use(table)
Vue.use(tableOperate)
Vue.use(tooltip)
Vue.use(divider)
Vue.use(drawer)
Vue.use(tag)
Vue.use(collapse)
Vue.use(Switch)
Vue.use(breadcrumb)
Vue.use(cascader)
Vue.use(autoComplete)
Vue.use(radio)
Vue.use(checkbox)
Vue.use(popconfirm)
Vue.use(select)
Vue.use(eTree)
Vue.use(datePicker)
Vue.use(VueCookies)

// 把组件化页面挂载到节点app上
new Vue({
  mixins: [taMixins],
  router,
  store
}).$mount('#app')
