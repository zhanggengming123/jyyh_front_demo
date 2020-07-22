<template>
  <div class="iframeList" ref="iframeCon">
    <ta-page-tool v-if="isPageTool" :toolMenu="toolMenu" :isRefresh="false"></ta-page-tool>
    <iframe :id="worktable.id"
            :style="worktableShow?'':'display:none'"
            :src="worktable.src"
            frameborder="none"
            frameBorder="0"
            scrolling="auto">
    </iframe>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'iframe-list',
  data () {
    return {
      src: '',
      CacheWebStorage: null,
      toolMenu: [{
        icon: 'rocket',
        name: '刷新全部',
        onClick: () => {
          this.CacheWebStorage.cleanData()
          window.location.reload()
        }
      }, {
        icon: 'sync',
        name: '刷新本页',
        onClick: () => {
          top.indexTool.reload()
        }
      }],
      iframeList: {},
      worktableShow: true
    }
  },
  created () {
    this.CacheWebStorage = this.Base.webStorage.init('Ta$CacheStorage')
  },
  computed: {
    ...mapGetters({
      tabList: 'getTabMenuList',
      activeTab: 'getActiveIframe',
      state: 'getStateValue'
    }),
    isPageTool () {
      const { notPageTool } = this.state
      /* faceConfig.js 中配置的菜单不显示 */
      return notPageTool.indexOf(this.activeTab.module) == -1 && notPageTool.indexOf(this.activeTab.partId) == -1
    },
    worktable () {
      const { worktable } = this.state
      const cg = {
        ...worktable,
        partId: 'worktable'
      }
      this.iframeList[this.createId(cg)] = cg
      return {
        id: this.createId(cg),
        src: this.createSrc(cg)
      }
    }
  },
  methods: {
    createIframe (menu) {
      const iframe = document.createElement('iframe')
      iframe.setAttribute('frameBorder', 'none')
      iframe.setAttribute('frameBorder', '0')
      iframe.setAttribute('scrolling', 'auto')
      iframe.id = this.createId(menu)
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      const src = this.createSrc(menu)
      iframe.setAttribute('src', src)
      return iframe
    },
    createSrc (menu) {
      let src = '', _modulePartId_ = ''
      src = this.createId(menu) + '#/' + menu.part
      _modulePartId_ = '_modulePartId_=' + menu.partId
      if (src.indexOf('?') > -1) {
        src += '&' + _modulePartId_
      } else {
        src += '?' + _modulePartId_
      }
      return src
    },
    createId (menu) {
      return menu.prefix + menu.module
    },
    hideIframe (menu) {
      if (menu.id == 'worktable') {
        this.worktableShow = false
        return
      }
      const el = document.getElementById(this.createId(menu))
      if (el) {
        el.style.display = 'none'
      }
    },
    showIframe (menu) {
      if (menu.id == 'worktable') {
        this.worktableShow = false
        return
      }
      const el = document.getElementById(this.createId(menu))
      const src = this.createSrc(menu)
      el.setAttribute('src', src)
      if (el) {
        el.style.display = 'block'
      }
    }
  },
  watch: {
    activeTab (nowTab, oldTab) {
      const mdId = this.createId(nowTab)
      if (this.iframeList[mdId]) {
        this.showIframe(nowTab)
        this.iframeList[mdId] = { ...nowTab }
      } else {
        this.iframeList[mdId] = { ...nowTab }
        this.createIframe(nowTab)
        this.$refs.iframeCon.appendChild(this.createIframe(nowTab))
      }
      if (mdId == this.createId(oldTab)) {
      } else {
        this.hideIframe(oldTab)
      }
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .iframeList {
    width: 100%;
    height: 100%;
    .user-select();
  }

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
