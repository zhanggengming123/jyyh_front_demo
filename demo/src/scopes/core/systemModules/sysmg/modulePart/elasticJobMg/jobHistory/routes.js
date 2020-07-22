// 导出该模块路由
export default [
  {
    title: '作业历史管理',
    name: 'jobHistory',
    path: 'jobHistory',
    component: () => import('./jobHistory.vue'),
    children: [
      {
        path: 'jobDatasourceConfig',
        name: 'jobDatasourceConfig',
        component: () => import('./part/jobDatasourceConfig.vue')
      },
      {
        path: 'jobExecutionTrace',
        name: 'jobExecutionTrace',
        component: () => import('./part/jobExecutionTrace.vue')
      },
      {
        path: 'jobStatusTrace',
        name: 'jobStatusTrace',
        component: () => import('./part/jobStatusTrace.vue')
      },
      {path: '', redirect: {name: 'jobDatasourceConfig'}}
    ]
  }
]
