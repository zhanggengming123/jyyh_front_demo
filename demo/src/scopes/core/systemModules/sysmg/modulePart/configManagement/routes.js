// 导出该模块路由
export default [
  {
    title: '配置管理',
    name: 'configManagement',
    path: 'configManagement',
    component: () => import('./configManagement.vue')
  }
]
