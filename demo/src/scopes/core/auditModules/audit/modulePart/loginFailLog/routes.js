// 导出该模块路由
export default [
  {
    title: '登录失败日志',
    name: 'loginFailLog',
    path: 'loginFailLog',
    component: () => import('./loginFailLog.vue')
  }
]
