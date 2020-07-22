import faceConfig from 'faceConfig'// 引入配置
// 菜单搜索
function fnCreateCheckedResourceIds (item, list, value) {
  if (item.children) {
    item.children.forEach((item) => {
      fnCreateCheckedResourceIds(item, list, value)
    })
  }
  if ((!item.children || (item.children && item.children.length === 0)) && item.name && item.name.indexOf(value) >= 0) {
    list.push(item)
  }
};

const indexStore = {
  state: {
    menuList: [], // 所有菜单
    ...faceConfig.indexPageConfig, // 首页配置数据
    collapsed: false, // 左侧菜单展开收起状态（默认展开）
    showUserInfo: false, // 是否显示右侧用户信息
    tabMenuList: [], // 被打开的作为tab的菜单
    activeTabMenu: 'worktable', // 默认被打开的为工作台
    activeMenuOne: false, // 一级菜单激活的选项 false为没有激活选项（默认选中第一个）
    activeMenuTwo: '', // 二级菜单激活的选项false//''没有激活选项,
    ifSearchPane: false, // 是否显示搜索框
    searchValue: '', // 搜索框的值
    userInfo: {
      userName: '未登录',
      userImg: 'person-head.png',
      mainRoleName: ''
    },
    sysInfo: {
      openSocialLogin: false,
      openSmsLogin: false
    },
    authority: [],
    breadcrumb: [] // 面包屑
  },
  getters: {
    getStateValue: state => state,
    getMenuListLeft: (state) => {
      let list = []
      if (state.menuType == 'leftTop') {
        try {
          // 判断activeMenuOne是否有子节点
          const l = state.menuList.filter(item => item.id === state.activeMenuOne)
          list = l[0].children || []
        } catch (error) {
          list = []
        }
      } else if (state.menuType == 'left') {
        list = state.menuList
      }
      return list
    },
    getCollapsed: (state) => {
      return state.collapsed
    },
    getSearchMenuList: (state) => {
      const list = []
      fnCreateCheckedResourceIds({ children: state.menuList }, list, state.searchValue)
      return list
    },
    getTabMenuList: (state) => {
      return state.tabMenuList
    },
    getActiveIframe: (state) => {
      const menuId = state.activeTabMenu

      if (menuId === 'worktable') {
        const { worktable } = state
        return {
          ...worktable,
          partId: 'worktable'
        }
      }
      const menu = state.tabMenuList.filter(item => item.id === menuId)[0] || ''
      if (menu.url) {
        return {
          partId: menu.id,
          module: menu.url.split('#/')[0],
          part: menu.url.split('#/')[1] || '',
          prefix: menu.prefix || state.srcPrefix
        }
      } else {
        return {
          module: '404.html',
          part: '',
          partId: 'ta404',
          prefix: menu.prefix || state.srcPrefix
        }
      }
    }
  },
  actions: {
    // state 赋值
    setStateValue ({ commit }, value) {
      commit('_setStateValue', value)
    },
    loadMenuList ({ commit }, { menuList }) {
      // 设置菜单menuList
      commit('_setStateValue', { menuList: JSON.parse(JSON.stringify(menuList || [])) })
      // 初始化激活的菜单
      let actMenu = false
      if (menuList[0] && menuList[0].id) {
        actMenu = menuList[0].id
      }
      commit('_setActiveMenu', { level: 'one', menuId: actMenu, init: true })
    },
    setActiveMenu ({ commit }, { level, menuId }) {
      commit('_setActiveMenu', { level, menuId })
    },
    setUserInfo ({ state, commit }) {
      if (state.userInfo.userName == '未登录') {
        return new Promise((resolve, reject) => {
          Base.submit(null, {
            url: 'indexRestService/getCurUserAccount'
          }, {
            successCallback: (data) => {
              const info = {
                ...data.data.curUserAccount,
                passwordRSA: data.data.passwordRSA || true,
                isSSO: data.data.isSSO || false
              }
              commit('_setUserInfo', info || {})
              resolve(state.userInfo)
            }
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.userInfo)
        })
      }
    },
    setSysInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        Base.submit(null, {
          url: 'indexRestService/getSysInfo'
        }, {
          successCallback: (data) => {
            const sysInfo = {
              openSocialLogin: data.data.openSocialLogin || false,
              openSmsLogin: data.data.openSmsLogin || false
            }
            commit('_setSysInfo', sysInfo || {})
            resolve(state.sysInfo)
          }
        })
      })
    },
    setAuthority ({ commit }) {
      Base.submit(null, {
        url: 'menu/menuAction/queryAllElement'
      }, {
        successCallback: (data) => {
          commit('_setAuthority', data.data.list || [])
        }
      })
    },
    addTabMenuList ({ commit }, { value }) {
      if (value && value.id && (value.children === undefined || value.children.length <= 0)) {
        commit('_addTabMenuList', value)
      }
    },
    deleteTabMenuList ({ commit }, { value }) {
      commit('_deleteTabMenuList', value)
    }

  },
  mutations: {
    _setStateValue (state, value) {
      Object.assign(state, value)
    },
    _setActiveMenu (state, { level, menuId, init }) {
      const { activeMenuOne, menuType, menuList } = state
      // 一级菜单设置，默认选中第一个（可设置其他默认值）
      if (level == 'one' && !(init && activeMenuOne != false)) {
        state.activeMenuOne = menuId
        // 第一个菜单没有子菜单时，不选中
        if (init && !(menuList[0].children && menuList[0].children.length)) {
          state.activeMenuOne = ''
        }
      } else if (level == 'two') {
        state.activeMenuTwo = menuId
      }
    },
    _setUserInfo (state, value) {
      state.userInfo = Object.assign(state.userInfo, value || {})
    },
    _setSysInfo (state, value) {
      state.sysInfo = Object.assign(state.sysInfo, value || {})
    },
    _setAuthority (state, auth) {
      state.authority = auth
    },
    _addTabMenuList (state, value) {
      if (value.id === 'b93e89515da24041b9f1459f77de38fe') {
        state.activeTabMenu = 'worktable'
        return false
      }
      if (state.barType === 'breadcrumb') {
        state.tabMenuList = [value]
        state.activeTabMenu = value.id
        return false
      }
      if (state.tabMenuList.filter(item => item.id === value.id).length <= 0) {
        state.tabMenuList.push(value)
      }
      state.activeTabMenu = value.id
    },
    _deleteTabMenuList (state, value) {
      try {
        state.tabMenuList = JSON.parse(JSON.stringify(state.tabMenuList.filter(item => item.id !== value)))
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export default indexStore
