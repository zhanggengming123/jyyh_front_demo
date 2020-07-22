// 导出该模块路由
export default [
  {
    title: '应用管理',
    name: 'appManagement',
    path: 'appManagement',
    component: () => import('./appManagement.vue')
  },
  {
    title: '概况',
    path: 'console',
    component: () => import('./part/console.vue'),
    children: [
      {
        path: '/',
        component: () => import('./part/dashboard.vue')
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('./part/dashboard.vue')
      },
      {
        path: '/assemble',
        name: 'assemble',
        component: () => import('./part/assemble.vue')
      },
      {
        path: '/dataInfo',
        name: 'dataInfo',
        component: () => import('./part/dataInfo.vue')
      },
      {
        path: '/siteSetting',
        component: () => import('./part/siteSetting.vue'),
        children: [
          {
            path: '/',
            name: 'deploymentSetting',
            component: () => import('./part/deploymentSetting.vue')
          }
        ]
      }
    ]
  }
]
