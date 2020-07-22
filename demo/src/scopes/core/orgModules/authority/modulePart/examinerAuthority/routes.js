// 导出该模块路由
export default [
  {
    title: '审核角色管理',
    name: 'examinerAuthority',
    path: 'examinerAuthority',
    component: () => import('./examinerAuthority.vue'),
    children: [
      {
        path: 'addRole',
        name: 'addRole',
        component: () => import('./part/role/addRole.vue')
      },
      {
        path: 'roleAuthority',
        name: 'roleAuthority',
        component: () => import('./part/role/roleAuthorityMg.vue')
      },
      {
        path: 'roleManagement',
        name: 'roleManagement',
        component: () => import('./part/role/roleManagement.vue')
      },
      {
        path: 'roleOrgAuthority',
        name: 'roleOrgAuthority',
        component: () => import('./part/role/roleOrgAuthority.vue')
      },
      {
        path: 'roleUserMg',
        name: 'roleUserMg',
        component: () => import('./part/role/roleUserMg.vue')
      },

      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import('./part/user/userManagement.vue')
      },
      {
        path: 'userRoleMg',
        name: 'userRoleMg',
        component: () => import('./part/user/userRoleMg.vue')
      },
      { path: '', redirect: { name: 'roleManagement' } }
    ]
  }
]
