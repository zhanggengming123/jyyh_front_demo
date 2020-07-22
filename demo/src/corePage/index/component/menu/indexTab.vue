<template>
  <div class="fit">
    <div v-if="state.barType == 'tab'" class="index-tabs" ref="index-tabs">
      <div class="worktable-tab" id="worktable" @click="setTabsted({id:'worktable'})" :title="worktableName" ref="index-worktable"
           :class="{active:activeTab=='worktable'}">{{worktableName}}
      </div>
      <div class="tab-item"
           ref="tab-item"
           v-for="menu in list1"
           @click="setTabsted(menu)"
           :class="{active:activeTab==menu.id}"
           :key="menu.id"
           :title="menu.name"
           :id="menu.id+'-tab'">
        <div>{{menu.name}}</div>
        <span class="btn-close" @click.stop="closeTabFn(menu)">
          <ta-icon type="close"/>
        </span>
      </div>
      <div class="tab-more" :class="{active:ifShowMore}" ref="tab-more" flag="tab-more">
      <span @click.stop="ifShowMore=ifShowMore?false:true" flag="tab-more">
        <ta-icon type="setting"/>
      </span>
        <div v-if="ifShowMore" class="tab-more-list" flag="tab-more">
          <div @click.stop="setTabsted({id:'worktable'})" class="more-worktable" flag="tab-more">工作台</div>
          <div class="tab-item"
               v-for="menu in list2"
               :id="menu.id+'-tab'"
               :key="menu.id"
               :title="menu.name"
               @click.stop="setTabsted(menu)"
               flag="tab-more">
            {{menu.name}}
            <span flag="tab-more">
            <ta-icon v-if="activeTab===menu.id" type="activeTab==menu.id?'close-circle':close"
                     @click.stop="closeTabFn(menu)"/>
          </span>
          </div>
          <div class="close-all" flag="tab-more" @click="closeAllTab()">关闭所有</div>
        </div>
      </div>
    </div>
    <ta-breadcrumb v-else class="index-breadcrumb">
      <ta-breadcrumb-item>
        <a @click="toWorktable">
          <ta-icon type="home"/>
          {{worktableName}}</a>
      </ta-breadcrumb-item>
      <ta-breadcrumb-item v-for="(item, index) in state.breadcrumb" :key="index">{{item}}</ta-breadcrumb-item>
    </ta-breadcrumb>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'index-tab',
  data () {
    return {
      list1: [],
      list2: [],
      ifShowMore: false
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      collapsed: 'getCollapsed',
      tabList: 'getTabMenuList'
    }),
    activeTab () {
      return this.state.activeTabMenu
    },
    worktableName () {
      const { worktable } = this.state
      return worktable.name || '工作台'
    }
  },
  mounted: function () {
    window.addEventListener('resize', () => {
      this.setTab()
    }, false)
  },
  methods: {
    // 设置tab长度
    setTab () {
      if (this.state.barType == 'tab') {
        this.list1 = this.tabList
        this.list2 = []
        var conL = this.Base.getWidth(this.$refs['index-tabs'])// 容器宽度
        var tabsL = parseInt(this.Base.getWidth(this.$refs['index-worktable'])) + 80// 工作台+更多空白
        var items = this.tabList
        var L1 = []
        var L2 = []
        this.$nextTick(function () {
          if (this.activeTab !== 'worktable') {
            tabsL = tabsL + this.Base.getWidth(document.getElementById(this.activeTab + '-tab'))
          }
          for (let i = 0; i < items.length; i++) {
            // 激活菜单直接加入
            if (items[i].id === this.activeTab) {
              L1.push(items[i])
              continue
            }
            tabsL += this.Base.getWidth(document.getElementById(items[i].id + '-tab'))
            if (conL > tabsL) {
              L1.push(items[i])
            } else {
              L2.push(items[i])
            }
          }
          this.list1 = L1.concat([])
          this.list2 = L2.concat([])
        })
      }
    },
    // 设置选中的事件
    setTabsted (menu) {
      // 更新 activeTab
      this.$store.dispatch('setStateValue', { activeTabMenu: menu.id })
      if (menu.id === 'worktable') {
        menu.id = 'b93e89515da24041b9f1459f77de38fe'
      }
      this.$store.dispatch('setActiveMenu', { level: 'two', menuId: menu.id })
      this.ifShowMore = false
    },
    // 设置关闭事件
    closeTabFn (menu) {
      // 找到index
      // 判断是否是activeTab;
      if (menu.id === this.activeTab) {
        const nowIndex = this.list1.findIndex(item => item.id == menu.id)
        let actTb = 'worktable'
        if (this.list1[nowIndex + 1]) {
          actTb = this.list1[nowIndex + 1].id
        }
        if (this.list1[nowIndex - 1]) {
          actTb = this.list1[nowIndex - 1].id
        }
        if (this.list2.length > 0) {
          actTb = this.list2[0].id
        }
        this.$store.dispatch('setStateValue', { activeTabMenu: actTb })
        if (this.state.menuType == 'top') {
          this.$store.dispatch('setActiveMenu', { level: 'two', menuId: actTb })
        }
      }
      // 删除 对应的index
      this.$store.dispatch('deleteTabMenuList', { value: menu.id })
      this.ifShowMore = false
    },
    // 关闭所有Tab
    closeAllTab () {
      this.$store.dispatch('setStateValue', { activeTabMenu: 'worktable', tabMenuList: [], activeMenuTwo: '' })
      this.ifShowMore = false
    },
    toWorktable () {
      this.$store.dispatch('setStateValue', {
        activeTabMenu: 'worktable',
        tabMenuList: [],
        breadcrumb: [],
        activeMenuTwo: ''
      })
    }
  },
  watch: {
    tabList (now, old) {
      this.setTab()
    },
    activeTab (now, old) {
      // 如果激活的有改变那么重绘
      this.setTab()
    },
    collapsed (val) {
      // 菜单展开收起时重绘
      this.setTab()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  //高度配置等
  @index-tabs-height :39px;
  @border-color: @border-color-base;
  .index-tabs {
    width: 100%;
    height: 100%;
    position: relative;
    min-width: 300px;
    background-color: #fff;
    .user-select();
    z-index: 998;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    .worktable-tab {
      min-width: 120px;
    }
    > .worktable-tab, > .tab-item {
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
      padding: 0px 15px;
      height: @index-tabs-height;
      line-height: @index-tabs-height;
      font-size: 14px;
      text-align: center;
      float: left;
      position: relative;
      max-width: 200px;
      > div {
        float: left;
        max-width: 145px;
        .text-overflow();
      }
      .close-icon-style {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' data-v-b6702f48='' viewBox='64 64 896 896' data-icon='close-circle' width='1em' height='1em' fill='%23f5222d' aria-hidden='true' class=''%3E%3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: center 14px; background-size: contain;
        svg { display: none }
      }

      &.active {
        color: @primary-color;
        border-bottom: solid 1px @primary-color;
        .btn-close {
          .close-icon-style
        }
      }

      .btn-close { margin-left: 10px; color: @text-color-secondary; display: block; float: left; width: 12px; height: 39px;
        i { vertical-align: 0; }
        svg { width: 10px; height: 10px; }
        &:hover {
          .close-icon-style
        }
      }
    }
  }

  .tab-more {
    height: 100%;
    width: 36px;
    text-align: center;
    float: left;
    position: relative;

    > span {
      color: @text-color-secondary;
      position: absolute;
      bottom: 8px;
      width: 15px;
      height: 19px;
      left: 0px;
      cursor: pointer;
      border-left: 1px solid @border-color;
      padding-left: 10px;
      margin-left: 10px;
    }

    &.active, &:hover {
      > span {
        color: @primary-color;
      }
    }

    .tab-more-list {
      position: absolute;
      width: 200px;
      z-index: 999;
      .beautifyScrollbar();
      overflow: auto;
      padding: 5px 5px 10px 5px;
      max-height: 500px;
      overflow-y: auto;
      background-color: #fff;
      text-align: left;
      font-size: 14px;
      right: -40px;
      border-radius: @border-radius-base;
      top: @index-tabs-height + 5px;
      box-shadow: @box-shadow-base;
      > div {
        height: 32px;
        line-height: 32px;
        color: @text-color-secondary;
        margin: 0 10px;
        padding: 0 10px;
        border-bottom: dashed 0.5px @border-color;
        cursor: pointer;
        text-align: left;
        .text-overflow();

        > span {
          float: right;
          display: inline-block;
          height: 32px;
          line-height: 32px;
          padding: 0px 10px;
          color: @text-color-secondary;
          font-size: 10px;
        }

        &:hover {
          background: #fafafa;

          > span > i {
            &:before {
              color: @error-color;
              content: "\E633";
            }
          }
        }

        &.more-worktable {
          height: 40px;
          color: @primary-color;
          line-height: 40px;
          border-bottom: solid 0.5px @border-color;

          &:hover {
            background: #fff;
          }
        }

        &.close-all {
          text-align: center;
          color: #fff;
          background: @primary-color;
          border-bottom: none;
        }
      }
    }
  }

  .index-breadcrumb {
    width: 100%;
    height: 100%;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    line-height: 40px;
    padding-left: 20px;
    box-sizing: border-box;
  }
</style>
