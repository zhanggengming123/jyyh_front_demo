// 导出该模块路由
export default [
  {
    title: '系统配置管理',
    name: 'systemConfigManagement',
    path: 'systemConfigManagement',
    component: () => import('./systemConfigManagement.vue')
  }
]
