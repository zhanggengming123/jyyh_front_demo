// 导出该模块路由
export default [
  {
    title: '接入系统列表',
    name: 'accessSystem',
    path: 'accessSystem',
    component: () => import('./accessSystem.vue')
  }
]
