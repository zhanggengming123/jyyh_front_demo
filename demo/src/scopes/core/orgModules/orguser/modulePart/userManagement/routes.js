// 导出该模块路由
export default [
  {
    title: '人员管理',
    name: 'userManagement',
    path: 'userManagement',
    component: () => import('./userManagement.vue')
  }
]
