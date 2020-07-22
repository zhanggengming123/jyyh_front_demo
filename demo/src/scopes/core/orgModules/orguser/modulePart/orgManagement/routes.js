// 导出该模块路由
export default [
  {
    title: '组织机构管理',
    name: 'orgManagement',
    path: 'orgManagement',
    component: () => import('./orgManagement.vue')
  }
]
