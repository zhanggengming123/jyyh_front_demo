// 导出该模块路由
export default [
  {
    title: '用户信息可管理字段配置',
    name: 'userInfoManagement',
    path: 'userInfoManagement',
    component: () => import('./userInfoManagement.vue')
  }
]
