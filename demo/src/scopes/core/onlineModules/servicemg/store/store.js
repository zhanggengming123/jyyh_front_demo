const moduleStore = {
  state: {
    onlineCode: {
      templateContent: ``,
      templateName: ``,
      templateType: ``,
      templateId: ``
    },
    pageInfo: {},
    templateInfo: {},
    onlineEditor: {}
  },
  getters: {
    getOnlineCode: (state) => {
      return state.onlineCode
    },
    getPageInfo: (state) => {
      return state.pageInfo
    },
    getTemplateInfo: (state) => {
      return state.templateInfo
    },
    getState: (state) => {
      return state
    },
    getOnlineEditor: (state) => {
      return state.onlineEditor
    }
  },
  mutations: {
    setState (state, obj) {
      Object.assign(state, obj)
      // 保存本地
      // localStorage.store = JSON.stringify(state)
    },
    setOnlineCode (state, value) {
      state.onlineCode = Object.assign(state.onlineCode, value || {})
    },
    setPageInfo: (state, value) => {
      state.pageInfo = value
    },
    setTemplateInfo: (state, value) => {
      state.templateInfo = value
    },
    setOnlineEditor: (state, value) => {
      state.onlineEditor = value
    }
  },
  actions: {
  }
}

export default moduleStore
