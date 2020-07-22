const indexTools = (indexObj) => {
  // 获取当前登录人员信息
  function getUserInfo () {
    return indexObj.$store.state.indexStore.userInfo
  }

  // 获取菜单的权限
  function getMenuAuthority (moduleId) {
    const list = indexObj.$store.state.indexStore.authority
    const index = list.findIndex(el => el.resourceId === moduleId)
    // 有权限数据   有权限验证要求 才进行权限验证
    if (list[index] && list[index].authority !== '0') {
      return list[index]
    }
    return false
  }

  // 打开一个菜单页
  function openTabMenu (item) {
    if (!item.name) {
      item.name = 'new tab'
    }
    indexObj.$store.dispatch('addTabMenuList', { value: item })
    if (item.refresh) {
      reload(item.url)
    }
  }

  // 关闭一个菜单页
  function closeTabMenu (value) {
    indexObj.$refs.indexTab.closeTabFn({ id: value })
  }

  // 关闭首页的所有弹出泡泡
  function closeIndexPops () {
    // 关闭用户框框
    indexObj.$store.dispatch('setStateValue', { showUserInfo: false })
    // 关闭tab更多选项卡框框
    indexObj.$refs.indexTab.ifShowMore = false
  }

  // 获取当前菜单id
  function getActiveTabMenuId () {
    let menuId = ''
    try {
      menuId = indexObj.$store.state.indexStore.activeTabMenu
    } catch (e) {

    }
    return menuId
  }

  // 获取当前人员所有菜单
  function getMenuList () {
    let menu = []
    try {
      menu = menu.concat(indexObj.$store.state.indexStore.menuList)
    } catch (e) {

    }
    return menu
  }

  // 刷新指定页面,如果传入页面的url,那么刷新指定url页面,如果不传入,那么刷新当前页面
  function reload (page) {
    try {
      let pageName = ''
      if (page) {
        pageName = page.split('#/')[0]
      } else {
        pageName = indexObj.$store.getters.getActiveIframe.module
      }
      if (pageName === 'worktable') {
        pageName = 'worktableIframe'
      }
      const pageObj = document.getElementById(pageName).contentWindow.pageVmObj
      pageObj.$bus.emit('refresh')
    } catch (e) {

    }
  }

  return {
    getUserInfo,
    getMenuAuthority,
    openTabMenu,
    closeTabMenu,
    closeIndexPops,
    getActiveTabMenuId,
    reload,
    getMenuList
  }
}

export default indexTools
