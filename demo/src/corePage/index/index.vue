<template>
  <div id="app">
    <index-layout ref="indexLayout">
      <div slot="logo" class="logo-image" :title="indexStore.collapsed ? indexStore.logoTitle : '' " :class="{'logo-collapse': indexStore.collapsed}" :style="{backgroundImage: 'url(' + require('./img/' + indexStore.logoImage) + ')'}">
        <span v-if="!indexStore.collapsed">{{indexStore.logoTitle}}</span>
      </div>
      <!--顶部菜单-->
      <menu-horizon slot="topMenu" v-show="indexStore.menuType != 'left'"></menu-horizon>
      <!--左侧菜单-->
      <menu-vertical slot="leftMenu"></menu-vertical>
      <search-pane slot="searchPane"></search-pane>
      <index-tab slot="tabs" ref="indexTab"></index-tab>
      <iframe-list slot="iframes"></iframe-list>
      <user-menu slot="userInfo"></user-menu>
    </index-layout>
  </div>
</template>
<script>
import indexLayout from './component/indexLayout'
import MenuHorizon from './component/menu/menuHorizon'
import MenuVertical from './component/menu/menuVertical'
import searchPane from './component/menu/searchPane'
import IndexTab from './component/menu/indexTab'
import IframeList from './component/menu/iframeList'
import UserMenu from './component/user/userMenu'
import indexTool from './js/indexTools'
export default {
  name: 'index',
  components: {
    UserMenu,
    IframeList,
    IndexTab,
    MenuVertical,
    MenuHorizon,
    indexLayout,
    searchPane
  },
  created () {
    // 获取用户信息
    this.$store.dispatch('setUserInfo')
    // 获取系统信息
    this.$store.dispatch('setSysInfo')
    // 获取menu
    this.Base.submit(null, {
      url: 'menu/menuAction/queryRootChildrenMenus'
    }, {
      successCallback: (data) => {
        let menuList = []
        try {
          menuList = data.data.menus.children
        } catch (error) {

        }
        this.$store.dispatch('loadMenuList', { menuList: menuList })
      }
    })
    // 获取权限信息
    this.$store.dispatch('setAuthority')
    const modeStorage = this.Base.webStorage.init('index_mode', { isLocal: true })
    this.$store.dispatch('setStateValue', { menuType: modeStorage.get('mode') || this.indexStore.menuType })
  },
  computed: {
    indexStore () {
      return this.$store.state.indexStore
    }
  },
  mounted () {
    // ie9 不存在history.pushState
    // TODO:引入html5.js保证一致体验
    if (history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
      })
    }
    window.indexTool = indexTool(this)
  }
}
</script>
<style scoped type="text/less" lang="less">
  #app { height: 100% }
  .logo-image { width: 100%; height: 100%; background-size: 40px 40px; box-sizing: border-box; background-position: 5px center; background-repeat: no-repeat; color: #ffffff; padding-left: 50px; text-align: left; font-size: 20px; }
  .logo-collapse { background-position: center; padding-left: 0px; }
</style>
