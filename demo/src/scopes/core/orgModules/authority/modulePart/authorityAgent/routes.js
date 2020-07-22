// 导出该模块路由
export default [
  {
    title: '权限代理',
    name: 'authorityAgent',
    path: 'authorityAgent',
    component: () => import('./authorityAgent.vue')
  }
]
