// 导出该模块路由
export default [
  {
    title: '审核权限',
    name: 'examineManagement',
    path: 'examineManagement',
    component: () => import('./examineManagement.vue')
  },
  {
    title: '审核记录',
    name: 'examineManagement',
    path: 'examineManagementLog',
    component: () => import('./examineManagementLog.vue')
  }
]
