// 导出该模块路由
export default [
  {
    title: '登录日志统计',
    name: 'loginLogAnalysis',
    path: 'loginLogAnalysis',
    component: () => import('./loginLogAnalysis.vue'),
    children: [
      {
        path: 'online',
        name: 'online',
        component: ()=>import('./part/online.vue')
      },
      {
        path: 'loginHistory',
        name: 'loginHistory',
        components: {
          loginHistory: ()=>import('./part/loginHistory.vue')
        }
      },
      {
        path: 'environment',
        name: 'environment',
        components: {
          environment: ()=>import('./part/environment.vue')
        }
      }
    ]
  },
];

