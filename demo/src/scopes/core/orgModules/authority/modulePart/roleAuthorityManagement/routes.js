// 导出该模块路由
export default [
  {
    title: '角色权限管理',
    name: 'roleAuthorityManagement',
    path: 'roleAuthorityManagement',
    component: () => import('./roleAuthorityManagement.vue'),
    children: [
      {
        name: 'publicRoleManager',
        path: 'publicRoleManager',
        component: () => import('./part/publicRole/publicRoleManager.vue')
      },
      {
        name: 'userRole',
        path: 'userRole',
        component: () => import('./part/userRole/userRole.vue')
      },
      {path: '', redirect: {name: 'publicRoleManager'}}
    ]
  },
  {
    name: 'publicRoleUser',
    path: 'publicRoleUser',
    component: () => import('./part/publicRole/publicRoleUser.vue')
  },
  {
    name: 'publicRoleAuthority',
    path: 'publicRoleAuthority',
    component: () => import('./part/publicRole/publicRoleAuthority.vue')
  },
  {
    name: 'publicRoleCustomAuthority',
    path: 'publicRoleCustomAuthority',
    component: () => import('./part/publicRole/publicRoleCustomAuthority.vue')
  },
  {
    name: 'roleMg',
    path: 'roleMg',
    component: () => import('./part/userRole/roleMg.vue')
  },
  {
    name: 'batchAuthority',
    path: 'batchAuthority',
    component: () => import('./part/publicRole/batchAuthority.vue')
  }
]
