import Vue from 'vue'
// 引入基础工具
import formUtil from '@yh/ta404-ui/es/utils/js/form.util'
import pinyin from '@yh/ta404-ui/es/utils/js/pinyin'
import sorter from '@yh/ta404-ui/es/utils/js/sorter'
import webStorage from '@yh/ta404-ui/es/utils/js/webStorage'
import collectionUtil from '@yh/ta404-ui/es/utils/js/collectionUtil'
import downloadFile from '@yh/ta404-ui/es/utils/js/downloadFile'
import cookieUtil from '@yh/ta404-ui/es/utils/js/cookie.util'
import elementUtil from '@yh/ta404-ui/es/utils/js/element.util'
import momentUtil from '@yh/ta404-ui/es/utils/js/moment.util'
import objectUtil from '@yh/ta404-ui/es/utils/js/object.util'
import urlUtil from '@yh/ta404-ui/es/utils/js/url.util'
import windowUtil from '@yh/ta404-ui/es/utils/js/window.util'
import browserType from '@yh/ta404-ui/es/utils/js/browser.util'
// 引入基础组件
import {
  button,
  containerMask,
  form,
  icon,
  input,
  localeProvider,
  message,
  modal,
  spin,
  borderLayout,
  col,
  row,
  notification,
  configProvider
} from '@yh/ta404-ui'
const util = {
  ...collectionUtil,
  ...cookieUtil,
  downloadFile,
  ...elementUtil,
  ...formUtil,
  ...momentUtil,
  ...objectUtil,
  pinyin,
  ...sorter,
  ...urlUtil,
  webStorage,
  ...windowUtil,
  ...browserType
}
Vue.use(button)
Vue.use(form)
Vue.use(input)
Vue.use(modal)
Vue.use(icon)
Vue.use(spin)
Vue.use(containerMask)
Vue.use(message)
Vue.use(localeProvider)
Vue.use(configProvider)
Vue.use(borderLayout)
Vue.use(row)
Vue.use(col)
Vue.use(notification)
// 注册工具到Base上
Vue.prototype.Base = {
  ...util,
  ...containerMask.$mask
}
Vue.prototype.$message = message
Vue.prototype.$info = modal.info
Vue.prototype.$success = modal.success
Vue.prototype.$error = modal.error
Vue.prototype.$warning = modal.warning
Vue.prototype.$confirm = modal.confirm
Vue.prototype.$notification = notification
window.message = message
window.notification = notification
window.Modal = modal
window.Spin = spin
window.Base = Vue.prototype.Base
