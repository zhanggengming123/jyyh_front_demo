// 导出该模块路由
export default [
  {
    title: '日志动态配置',
    name: 'logConfig',
    path: 'logConfig',
    component: () => import('./logConfig.vue')
  }
]
