// 导出该模块路由
export default [
  {
    title: '作业管理',
    name: 'jobManager',
    path: 'jobManager',
    component: () => import('./jobManager.vue'),
    children: [
      {
        path: 'zookeeperRegistryCenterConfig',
        name: 'zookeeperRegistryCenterConfig',
        component: () => import('./part/zookeeperRegistryCenterConfig.vue')
      },
      {
        path: 'jobDimensionality',
        name: 'jobDimensionality',
        component: () => import('./part/jobDimensionality.vue')
      },
      {
        path: 'serverDimensionality',
        name: 'serverDimensionality',
        component: () => import('./part/serverDimensionality.vue')
      },
      {
        path: 'freeBusyJobManager',
        name: 'freeBusyJobManager',
        component: () => import('./part/freeBusyJobManager.vue')
      },
      {
        path: 'jobDetail',
        name: 'jobDetail',
        component: () => import('./part/jobDetail.vue')
      },
      {
        path: 'serverDetail',
        name: 'serverDetail',
        component: () => import('./part/serverDetail.vue')
      },
      {path: '', redirect: {name: 'zookeeperRegistryCenterConfig'}}
    ]
  }
]
