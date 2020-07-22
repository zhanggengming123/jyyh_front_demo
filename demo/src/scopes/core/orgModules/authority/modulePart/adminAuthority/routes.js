// 导出该模块路由
export default [
  {
    title: '管理员权限管理',
    name: 'adminAuthority',
    path: 'adminAuthority',
    component: () => import('./adminAuthority.vue'),
    children: [
      {
        path: 'adminRoleManagement',
        name: 'adminRoleManagement',
        component: () => import('./part/role/adminRoleManagement.vue')
      },
      {
        path: 'adminUserMg',
        name: 'adminUserMg',
        component: () => import('./part/role/adminUserMg.vue')
      },
      {
        path: 'adminUseAuthority',
        name: 'adminUseAuthority',
        component: () => import('./part/role/adminUseAuthority.vue')
      },
      {
        path: 'adminGrantAuthority',
        name: 'adminGrantAuthority',
        component: () => import('./part/role/adminGrantAuthority.vue')
      },
      {
        path: 'adminOrgAuthority',
        name: 'adminOrgAuthority',
        component: () => import('./part/role/adminOrgAuthority.vue')
      },
      {
        path: 'adminObjectUseAuthority',
        name: 'adminObjectUseAuthority',
        component: () => import('./part/role/adminObjectUseAuthority.vue')
      },

      {
        path: 'adminObjectGrantAuthority',
        name: 'adminObjectGrantAuthority',
        component: () => import('./part/role/adminObjectGrantAuthority.vue')
      },
      {
        path: 'adminUserManagement',
        name: 'adminUserManagement',
        component: () => import('./part/user/adminUserManagement.vue')
      },
      {
        path: 'adminUserRoleMg',
        name: 'adminUserRoleMg',
        component: () => import('./part/user/adminUserRoleMg.vue')
      },
      {path: '', redirect: {name: 'adminRoleManagement'}}
    ]
  }
]
