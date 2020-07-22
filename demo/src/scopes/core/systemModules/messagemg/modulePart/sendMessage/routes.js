// 导出该模块路由
export default [
  {
    title: '消息历史管理',
    name: 'sendMessage',
    path: 'sendMessage',
    component: () => import('./sendMessage.vue')
  }
]
