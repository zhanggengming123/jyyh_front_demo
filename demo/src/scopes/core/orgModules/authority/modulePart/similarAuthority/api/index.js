const BASE_URL = '/org/authority/similarAuthorityManagementRestService/'
export default {
  // 查询可管理的组织树列表
  querySimilarAuthority (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCurrentUserRePermission', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 通过菜单id查询拥有该权限的角色列表
  queryRoleByMenuIds (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryUsePermissionRoleByResourceId', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  queryRePermissionResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryRePermissionResource', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  addBatchSimilarAuthority (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addBatchSimilarAuthority', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
