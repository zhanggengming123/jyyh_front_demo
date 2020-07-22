// 导出该模块路由
export default [
  {
    title: '作业操作',
    name: 'jobOperate',
    path: 'jobOperate',
    component: () => import('./jobOperate.vue'),
    children: [
      {
        path: 'jobDimensionality',
        name: 'jobDimensionality',
        component: () => import('./part/jobDimensionality.vue')
      },
      {
        path: 'serverDimensionality',
        name: 'serverDimensionality',
        components: {
          serverDimensionality: () => import('./part/serverDimensionality.vue')
        }
      }
    ]
  }
]
