// 导出该模块路由
export default [
  {
    title: '标签管理',
    name: 'tagManagement',
    path: 'tagManagement',
    component: () => import('./tagManagement.vue')
  }
]
