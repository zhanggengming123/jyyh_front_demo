import './util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
// 引入按需加载的基础组件
import './modules/baseModule'

import store from '@/common/store'
import taMixins from './mixins/mixins.js'
import VueBus from 'vue-bus'
import './util/authority'
import '@/common/less/reset.less'
// 添加框架组件样式覆盖样式文件
import '@projectCommon/styleCover/styleCover.less'
import { isIE9, isIE10, } from '@yh/ta404-ui/es/utils/js/browser.util'
if (isIE9() || isIE10()) {
  const { submit, } = require('@/common/js/polyfill/submit.polyfill')
  if (Base.submit) {
    Base.submit = submit
  }
}
window.faceConfig = faceConfig
Vue.use(VueBus)
// 数据字典初始化
const dict = require('@yh/ta404-ui/es/_dict')
dict.default.init(Vue, store)
export {
  Vue,
  store,
  taMixins
}
