<template>
  <div class="indexLayout">
    <header :style="{height: headerHeight}">
      <div class="logo" :style="[logoWidth, {lineHeight:headerHeight}]">
        <slot name="logo"></slot>
      </div>
      <div class="collapse" @click="toggleCollapsed" v-if="state.menuType != 'top'">
        <ta-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"></ta-icon>
      </div>
      <div>
        <slot name="topMenu"></slot>
      </div>
      <div class="userInfo" :class="{'menu-top': state.menuType == 'top'}">
        <span :style="{height:headerHeight,lineHeight:headerHeight}"
              @click="fullScreen"
                v-if="fullscreenVisible"
        >{{pageSizeCtr?'退出全屏':'全屏显示'}}</span>
        <span :style="{height:headerHeight,lineHeight:headerHeight}"
              @click="visible = true"
        ><ta-icon type="message"></ta-icon>消息<ta-badge :count="noticeNum" style="height:45px" :numberStyle="{boxShadow: '0 0 0 1px #d9d9d9 inset'}"/></span>
        <msg-list :visible.sync="visible" :noticeNum.sync="noticeNum" @close="visible = false"></msg-list>
        <span class="userPaneBar" :style="{height:headerHeight,lineHeight:headerHeight}"
              @click="showUserInfo"
        ><ta-icon type="user"></ta-icon>{{state.userInfo.userName}}</span>
      </div>
    </header>
    <slot name="userInfo"></slot>
    <div class="content" :style="{top:headerHeight, paddingLeft: state.menuType != 'top' ? leftWidth: 0}">
      <div class="leftCon" :style="{width:leftWidth, paddingTop:tabHeight}" v-if="state.menuType != 'top'">
        <div class="leftConHeader" v-if="!collapsed" :style="{height:tabHeight}">
          <span class="searchPaneBar" :class="{active:ifSearchPane}">
            <input placeholder="搜索..." type="text" v-model="seValue"
                   @keyup.enter="searchMenuListHandle($event)">
          </span>
          <ta-icon :type="ifSearchPane? 'close': 'search'" @click="searchPaneBarHandle"></ta-icon>
        </div>
        <div class="leftConContent">
          <slot name="leftMenu"></slot>
          <slot name="searchPane" v-if="ifSearchPane"></slot>
        </div>
      </div>
      <div class="dragBar" :style="{left:leftWidth}" v-if="state.menuType != 'top'"></div>
      <div class="centerCon" :style="{paddingTop:tabHeight}">
        <div class="tabsCon" :style="{height:tabHeight}">
          <slot name="tabs"></slot>
        </div>
        <div class="iframesCon">
          <slot name="iframes"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import msgList from './user/msgList'
export default {
  name: 'index-layout',
  data () {
    return {
      fullscreenVisible: !Base.isIE(),
      pageSizeCtr: false,
      seValue: '',
      visible: false,
      tabHeight: '40px',
      noticeNum: 0
    }
  },
  components: { msgList },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      collapsed: 'getCollapsed'
    }),
    logoWidth () {
      const { leftCloseWidth, leftWidth, logoWidth, collapsed, menuType } = this.state
      let width = logoWidth
      if (menuType != 'top') {
        if (collapsed) {
          width = leftCloseWidth
        } else {
          width = leftWidth
        }
      }
      return { width: width, minWidth: width }
    },
    leftWidth () {
      const { leftCloseWidth, leftWidth, collapsed } = this.state
      return collapsed ? leftCloseWidth : leftWidth
    },
    headerHeight () {
      return this.state.headerHeight
    },
    ifSearchPane () {
      return this.state.ifSearchPane
    }
  },
  methods: {
    searchMenuListHandle (e) {
      const value = e.target.value.trim()
      if (this.state.searchValue !== value) {
        this.$store.dispatch('setStateValue', { searchValue: value })
      }
      this.$store.dispatch('setStateValue', { ifSearchPane: true })
    },
    searchPaneBarHandle () {
      this.$store.dispatch('setStateValue', { ifSearchPane: !this.ifSearchPane })
    },
    toggleCollapsed () {
      this.$store.dispatch('setStateValue', { collapsed: !this.collapsed })
    },
    showUserInfo () {
      this.$store.dispatch('setStateValue', { showUserInfo: true })
    },
    // 全屏显示控制
    fullScreen () {
      if (this.pageSizeCtr === true) {
        this.pageSizeCtr = false
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else {
          if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else {
            if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen()
            } else {
              if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
              }
            }
          }
        }
      } else {
        this.pageSizeCtr = true
        const d = document.documentElement
        if (d.requestFullscreen) {
          d.requestFullscreen()
        } else {
          if (d.msRequestFullscreen) {
            d.msRequestFullscreen()
          } else {
            if (d.mozRequestFullScreen) {
              d.mozRequestFullScreen()
            } else {
              if (d.webkitRequestFullScreen) {
                d.webkitRequestFullScreen()
              }
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  @import "~@yh/ta404-ui/es/style/themes/default";
  .indexLayout {
    height: 100%;
    position: relative;
  }
  header {
    width: 100%;
    background-color: #fff;
    white-space: nowrap;
    display: table;
    box-sizing: border-box;
    min-width: 600px;
    .user-select();
    > div {
      display: table-cell;
      vertical-align: middle;
      &.collapse {
        width: 60px;
        min-width: 60px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.025);
          color: @primary-color;
        }
      }
    }
  }

  .logo {
    background-color: @primary-color;
    text-align: center;
    color: #fff;
    vertical-align: top;
    box-sizing: border-box;
  }
  .userInfo {
    width: 200px;
    padding-right: 20px;
    > span {
      vertical-align: top;
      padding: 0px 10px;
      display: inline-block;
      font-size: 12px;
      cursor: pointer;
      .text-overflow();
      .user-select();
      > i {
        margin-right: 8px;
        font-size: 14px;
      }
      &:hover {
        color: @primary-color;
      }
    }
    &.menu-top {
      span:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.2);
      }
      background: @primary-color;
      color: #ffffff;
    }
  }

  .dragBar {
    height: 100%;
    width: 8px;
    cursor: w-resize;
    position: absolute;
    opacity: 0;
  }

  .content {
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    padding: 0px;
    box-sizing: border-box;
    margin: 0px;
    overflow: hidden;

    .leftCon {
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      box-sizing: border-box;
      z-index: 1;
      background-color: #001529;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom left;
      .user-select();

      .leftConHeader {
        position: absolute;
        top: 0px;
        width: 100%;
        background-color: #001529;
        color: #fff;
        border-bottom: 1px solid #001529;
        overflow: hidden;

        > span {
          display: inline-block;
          height: 100%;
          line-height: inherit;
          cursor: pointer;
          width: calc(100% - 45px);

          &.searchPaneBar {
            overflow: hidden;

            > input {
              width: 100%;
              margin: 5px 10px 0px 15px;
              height: 26px;
              padding: 0px 10px;
              box-sizing: border-box;
              background-color: rgba(255, 255, 255, 0.13);
              border-radius: 2px;
              border: none;
              outline: none;
              color: rgba(255, 255, 255, 0.5);

              &::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 0.29);
                font-size: 14px;
              }
            }
          }
        }

        > i {
          position: absolute;
          right: 13px;
          opacity: 0.6;
          font-size: 18px;
          top: 10px;
          cursor: pointer;
        }
      }

      .leftConContent {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }

    .centerCon {
      width: 100%;
      position: relative;
      height: 100%;
      box-sizing: border-box;

      > div {
        width: 100%;
      }

      .tabsCon {
        top: 0px;
        position: absolute;
      }

      .iframesCon {
        height: 100%;
        position: relative;
      }
    }
  }
</style>
