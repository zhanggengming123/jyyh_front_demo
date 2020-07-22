// 导出该模块路由
export default [
  {
    title: '页面还原part 1',
    name: 'rePageDemoPart1',
    path: 'rePageDemoPart1',
    component: () => import('./modulePart1.vue')
  }
]
