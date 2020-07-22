// 导出该模块路由
export default [
  {
    title: '访问限制日志',
    name: 'accessDenyLog',
    path: 'accessDenyLog',
    component: () => import('./accessDenyLog.vue')
  }
]
