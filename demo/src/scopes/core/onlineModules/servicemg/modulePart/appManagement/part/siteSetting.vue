<template>
  <div class="siteSetting">
    <div class="setting-menu">
      <div class="menu-title">系统设置</div>
      <div class="menu-box"></div>
      <div class="menu-item" :class="{'active': activeMenu == item.value}" v-for="item in menuList" :key="item.value"
           @click="clickMenu(item)">{{item.label}}
      </div>
    </div>
    <div class="setting-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
const menuList = [{ label: '部署设置', value: '0' }]
export default {
  name: 'siteSetting',
  data () {
    return {
      menuList,
      activeMenu: '0'
    }
  },
  mounted () {

  },
  methods: {
    clickMenu (menu) {
      this.activeMenu = menu.value
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  @menu-width: 240px;
  .siteSetting {
    width: 100%;
    height: 100%;
    padding: 16px 0;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 2px;
    position: relative;
  }

  .setting-menu {
    border-right: 1px solid #e8e8e8;
    width: @menu-width;
    height: 100%;
  }

  .menu-title {
    font-size: 16px;
    padding-left: 24px;
    color: #222;
    border-bottom: solid #e8e8e8 1px;
    padding-bottom: 16px;
  }

  .menu-item {
    height: 40px;
    line-height: 40px;
    padding-left: 24px;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 6px;

    &.active {
      color: @primary-color;
      background-color: #e6f7ff;
      border-right: solid @primary-color 3px;
    }

    &:hover {
      color: @primary-color;
    }
  }

  .setting-content {
    position: absolute;
    left: @menu-width;
    right: 0;
    bottom: 0;
    top: 0;
    box-sizing: border-box;
    padding: 16px;
  }
</style>
