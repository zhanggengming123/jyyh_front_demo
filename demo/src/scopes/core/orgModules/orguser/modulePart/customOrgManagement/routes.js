// 导出该模块路由
export default [
  {
    title: '自定义组织管理',
    name: 'customOrgManagement',
    path: 'customOrgManagement',
    component: () => import('./customOrgManagement.vue'),
    children: [

    ]
  },
  {
    path: 'customOrgUser',
    name: 'customOrgUser',
    component: () => import('./part/customOrgUser.vue')
  },
  {path: '', redirect: {name: 'customOrgManagement'}}
]
