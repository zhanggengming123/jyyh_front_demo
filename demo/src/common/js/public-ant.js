import './util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
// 引入打包好Ta404UI
import Ta404UI from '@yh/ta404-ui/dist/ta404-ui'
import '@yh/ta404-ui/es/style/components.less'

import store from '@/common/store'
import taMixins from './mixins/mixins.js'
import VueBus from 'vue-bus'
import './util/authority'
import '@/common/less/reset.less'
// 添加框架组件样式覆盖样式文件
import '@projectCommon/styleCover/styleCover.less'
import { isIE9, isIE10, } from '@yh/ta404-ui/es/utils/js/browser.util'

window.faceConfig = faceConfig
Vue.use(Ta404UI)
Vue.use(VueBus)

if (isIE9() || isIE10()) {
  const { submit, } = require('@/common/js/polyfill/submit.polyfill')
  if (Base.submit) {
    Base.submit = submit
  }
}
// 数据字典初始化
const dict = require('@yh/ta404-ui/es/_dict')
dict.default.init(Vue, store)
export {
  Vue,
  store,
  taMixins
}
