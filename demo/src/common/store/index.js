import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import componentStore from '@yh/ta404-ui/es/store'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: debug,
  state: {
    width: [{
      attr: '15',
      preview: '70',
      components: '15'
    }, {
      attr: '20',
      preview: '60',
      components: '20'
    }, {
      attr: '25',
      preview: '50',
      components: '25'
    }],
    css: '', // 用户编辑的自定义css字符串
    activeUI: 'Ta404-UI',
    currentComponent: {}, // 预览视图的选中组件
    components: [], // 预览视图的组件树
    backupComponents: [], // 删除组件时备份的
    copiedComponents: []// 复制的组件
  },
  mutations: mutations,
  actions: actions,
  modules: {
    ...componentStore
  }
})

export default store
