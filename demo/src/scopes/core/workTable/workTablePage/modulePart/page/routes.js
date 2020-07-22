// 导出该模块路由
export default [
  {
    title: '工作台',
    name: 'page',
    path: 'page',
    component: () => import('./page.vue')
  }
]
