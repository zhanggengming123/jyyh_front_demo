// 导出该模块路由
export default [
  {
    title: '操作日志',
    name: 'operationLog',
    path: 'operationLog',
    component: () => import('./operationLog.vue')
  }
]
