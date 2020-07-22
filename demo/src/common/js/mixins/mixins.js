// 所有页面需要执行的mixins
const taMixins = {
  mounted () {
    // 兼容ie路由跳转
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener('hashchange', () => {
        const currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          if (Base.isIE9() || Base.isIE10()) {
            this.$router.go(0)
          } else {
            this.$router.push(currentPath)
          }
        }
      }, false)
    }
    document.body.addEventListener('mousedown', (e) => {
      sendMessage(window.top, 'indexTool.closeIndexPops')
    })
    window.pageVmObj = this

    // 添加路由钩子函数 携带 _modulePartId_
    if (this.$router) {
      this.$router.beforeEach((to, from, next) => {
        if (to.query._NOAUTHURL_ === true || to.params._NOAUTHURL_ === true) {
          next()
          return
        }
        if (!to.query._modulePartId_) {
          const toQuery = JSON.parse(JSON.stringify(to.query))
          toQuery._modulePartId_ = to.params._modulePartId_ || Base.getNowPageParam()._modulePartId_ || Base.getNowPageParam().___businessId
          next({
            name: to.name,
            path: to.path,
            query: toQuery,
            params: to.params,
          })
        } else {
          next()
        }
      })
    }
  },

}

export default taMixins
