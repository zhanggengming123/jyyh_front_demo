const BASE_URL = '/org/authority/adminAuthorityManagementRestService/'
export default {
  // 查询当前角色下的人员信息
  queryUsersByRoleId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryUsersByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量添加管理人员
  addBatchAdminUser(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addBatchRoleUsers', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量删除管理员
  deleteBatchAdmin(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchRole', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询组织
  queryAllTaOrg(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCurrentAdminRoleWrapOrgTree', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除管理员管理的人员信息
  deleteRoleUserByKey(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteRoleUserByKey', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量删除角色下人员信息
  deleteBatchRoleUsers(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchRoleUsers', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryBatchUserByOrgId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryUsersNoWraperByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  // 查询组织权限
  queryOrgPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'selectOrgScope', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 移除组织权限
  removeOrgPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeOrgScope', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询所有的组织权限
  selectPermissionOrgScope(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'selectPermissionOrgScope', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addOrgPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveOrgScope', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询使用权限
  queryBatchPermissionTreeData(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryBatchPermissionTreeData', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量操作使用权限和对象使用权限
  batchChangeAdminPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'batchChangeAdminPermission', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addAdminRole(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addAdminRole', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateAdmin(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateAdmin', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateBatchAdminStatus(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateRoleEffectiveByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询使用权限左侧菜单列表,
  queryUseSysPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryRootResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUsePermissionByResourceId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryChildResourceByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 保存管理员使用权限
  saveAdminUsePermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'changeResourceUsePermission', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 设置单个使用权限的有效期
  updateAdminUsePermissionEffectiveTime(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateUsePermissionEffectiveTime', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量设置使用权限有效期
  saveBatchAdminUsePermissionEffectiveTime(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchUsePermissionEffectiveTime', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询对象使用权限左侧菜单列表,
  queryObjectUseSysPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryRootCustomResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryObjectUsePermissionByResourceId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryChildCustomResourceByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 保存管理员对象使用权限
  saveAdminObjectUsePermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'changeCustomResourceUsePermission', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 设置单个自定义使用权限的有效期
  updateAdminObjectUsePermissionEffectiveTime(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateCustomResourceUsePermissionEffectiveTime', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量设置自定义使用权限有效期
  updateBatchAdminObjectUsePermissionEffectiveTime(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchCustomResourceUsePermissionEffectiveTime', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询授权权限左侧菜单列表,
  queryGrantSysPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryRootResourceAuthority', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryGrantPermissionByResourceId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryChildResourceAuthorityByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 保存管理员授权权限
  saveAdminGrantPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'changeResourceAuthority', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询对象授权权限左侧菜单列表,
  queryObjectGrantSysPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryRootCustomResourceAuthority', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryObjectGrantPermissionByResourceId(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryChildCustomResourceAuthorityByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 保存管理员对象授权权限
  saveAdminObjectGrantPermission(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'changeCustomResourceAuthority', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量保存管理员人员角色关系
  addBatchUserRole(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addBatchUserRole', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量删除管理员人员角色关系
  deleteBatchUserRole(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchUserRole', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 自定义资源授权查询子节点信息
  queryChildCustomResourceAsync(data, callBack){
    Base.submit(null, {url: BASE_URL + 'queryChildCustomResourceAsync', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
