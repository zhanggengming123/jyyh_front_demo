// 导出该模块路由
export default [
  {
    title: '静态资源管理',
    name: 'staticResourceMg',
    path: 'staticResourceMg',
    component: () => import('./staticResourceMg.vue')
  }
]
