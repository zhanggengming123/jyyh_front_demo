<template>
  <div class="menu-vertical">
    <ta-menu :mode="state.menuLeftStyle == 'dropdown' ? 'inline': 'vertical'" :inlineCollapsed="collapsed" theme="dark"
             :inlineIndent="10"
             :data="menuList" :props="props" :selectedKeys="[state.activeMenuTwo || '']" @click="clickMenu"
             :style="{width:'100%'}" :openKeys.sync="openKeys"></ta-menu>
  </div>
</template>
<script type="text/jsx">
import { mapGetters } from 'vuex'

export default {
  name: 'menu-vertical',
  data () {
    return {
      props: {
        key: 'id',
        title: 'name'
      },
      openKeys: []
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      collapsed: 'getCollapsed',
      menuList: 'getMenuListLeft'
    })
  },
  methods: {
    clickMenu ({ key, keyPath }) {
      this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key })
      let tabMenu = this.menuList
      for (let i = keyPath.length - 1; i > -1; i--) {
        tabMenu = i ? tabMenu.filter(item => item.id == keyPath[i])[0].children : tabMenu.filter(item => item.id == keyPath[i])[0]
      }
      this.$store.dispatch('addTabMenuList', { value: tabMenu })
      /* 面包屑名称 */
      if (this.state.barType == 'breadcrumb') {
        const breadcrumb = []
        const { menuType, menuList, activeMenuOne } = this.state
        let leftMenu = this.menuList
        if (menuType == 'leftTop') {
          breadcrumb.push(menuList.filter(item => item.id == activeMenuOne)[0].name)
        }
        for (let i = keyPath.length - 1; i > -1; i--) {
          leftMenu = leftMenu.filter(item => item.id == keyPath[i])[0]
          breadcrumb.push(leftMenu.name)
          leftMenu = i ? leftMenu.children : leftMenu
        }
        this.$store.dispatch('setStateValue', { breadcrumb: breadcrumb })
      }
    }
  },
  watch: {
    menuList (now, old) {
      if (this.state.dropdownOpenMenu) {
        let keys = []
        now.map((item) => {
          if (item.id) {
            keys.push(item.id)
          }
        })
        this.openKeys = keys
      } else {
        this.openKeys = []
      }
    }
  }
}

</script>
<style type="text/less" lang="less">
  .menu-vertical {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .beautifyScrollbar(@scrollbar-barcolor:fade(color(@primary-color),35%),@scrollbar-bgcolor:@menu-dark-bg,@active:@primary-color);

    .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-inline-collapsed > .ant-menu-item {
      text-align: center;
      padding: 0 !important;
    }
  }
</style>
