// 导出该模块路由
export default [
  {
    title: '服务事项管理',
    name: 'serviceManagement',
    path: 'serviceManagement',
    component: () => import('./serviceManagement.vue')
  }
]
