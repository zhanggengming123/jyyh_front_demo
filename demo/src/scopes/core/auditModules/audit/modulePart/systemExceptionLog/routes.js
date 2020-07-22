// 导出该模块路由
export default [
  {
    title: '系统异常日志',
    name: 'systemExceptionLog',
    path: 'systemExceptionLog',
    component: () => import('./systemExceptionLog.vue')
  }
]
