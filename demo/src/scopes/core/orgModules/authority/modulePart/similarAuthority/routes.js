// 导出该模块路由
export default [
  {
    title: '相似权限授权管理',
    name: 'similarAuthority',
    path: 'similarAuthority',
    component: () => import('./similarAuthority.vue')
  },
  {
    path: 'grantAuthority',
    name: 'grantAuthority',
    component: () => import('./part/grantAuthority.vue')
  }
]
