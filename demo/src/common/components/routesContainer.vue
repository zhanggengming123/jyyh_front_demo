<script type="text/jsx">
import zhCN from '@yh/ta404-ui/es/locale-provider/zh_CN'
// import enUS from '@yh/ta404-ui/es/locale-provider/default'
export default {
  name: 'routesContainer',
  props: {
    routesList: Array
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  created () {
    this.$bus.on('refresh', this.reload)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    popupContainer (trigger) {
      // 单独处理el-tree的弹出父容器
      if (trigger?.classList?.contains('el-tree-node__label')) {
        return trigger?.parentNode
      }
      // 此处将page-wrapper的第一个子元素作为所有弹出框/窗口的容器
      return this.$el.childNodes[0]
    }
  },
  render () {
    const locale = zhCN
    return (
      <div class="page-wrapper">
        <ta-config-provider getPopupContainer={ this.popupContainer }>
          <ta-locale-provider locale={locale}>
            {this.isRouterAlive
              ? <keep-alive>
                <router-view></router-view>
              </keep-alive>
              : ''}
          </ta-locale-provider>
        </ta-config-provider>
      </div>
    )
  },
  beforeDestroy () {
    this.$bus.off('refresh', this.reload)
  }
}
</script>

<style scoped type="text/less">
  .page-wrapper {
    height: 100%;
  }
</style>
