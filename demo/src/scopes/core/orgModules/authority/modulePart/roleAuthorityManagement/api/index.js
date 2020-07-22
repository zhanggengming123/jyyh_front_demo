const BASE_URL = 'org/authority/roleAuthorityManagementRestService/'
export default {
  queryCurrentAdminRoleWrapeOrgTree (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCurrentAdminRoleWrapeOrgTree', data: data, showPageLoading: false }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryRolesByOrgId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryRolesByOrgId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryAuthRole(data, callBack){
    Base.submit(null, {url: BASE_URL + 'queryAuthRole', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  copyResource (form, data, callBack) {
    Base.submit(form, { url: BASE_URL + 'copyResource', data: data, autoValid: true }, {
      successCallback: (data) => callBack(data)
    }).then((data) => {}).catch((error) => {})
  },
  queryUsePermissionByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryUsePermissionByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomUsePermissionByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomUsePermissionByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  copyRole (form, data, callBack) {
    Base.submit(form, { url: BASE_URL + 'copyRole', data: data, autoValid: true }, {
      successCallback: (data) => callBack(data)
    }).then((data) => {}).catch((error) => {})
  },
  queryRePermission (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryRePermission', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomRePermission (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomRePermission', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addBatchUsePermissionByMoreRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'addBatchUsePermissionByMoreRole', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteBatchUsePermissionByMoreRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchUsePermissionByMoreRole', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addRole (form, data, callBack) {
    Base.submit(form, { url: BASE_URL + 'addRole', data: data, autoValid: true }, {
      successCallback: (data) => callBack(data)
    }).then((data) => {}).catch((error) => {})
  },
  updateRoleByRoleId (form, data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateRoleByRoleId', data: data, autoValid: true }, {
      successCallback: (data) => callBack(data)
    }).then((data) => {}).catch((error) => {})
  },
  updateBatchUsePermissionEffectiveTime (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateBatchUsePermissionEffectiveTime', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateUsePermissionEffectiveTime (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateUsePermissionEffectiveTime', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addUsePermission (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'addUsePermission', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  changeRestAuthority (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'changeRestAuthority', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryRePermissionByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryRePermissionByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateBatchCustomResourceUsePermissionEffectiveTime (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateBatchCustomResourceUsePermissionEffectiveTime', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateCustomResourceUsePermissionEffectiveTime (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateCustomResourceUsePermissionEffectiveTime', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomRePermissionByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomRePermissionByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addCustomResourceUsePermission (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'addCustomResourceUsePermission', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateRoleEffectiveByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateRoleEffectiveByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteBatchRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchRole', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteRoleUserByKey (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteRoleUserByKey', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUsersByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryUsersByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUsersNoWraperByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryUsersNoWraperByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addBatchRoleUsers (data, callBack, failCallback) {
    Base.submit(null, { url: BASE_URL + 'addBatchRoleUsers', data: data, showPageLoading: false }, {
      successCallback: (data) => callBack(data),
      failCallback: (data) => failCallback(data)
    })
  },
  deleteBatchRoleUser (data, callBack, failCallback) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchRoleUser', data: data, showPageLoading: false }, {
      successCallback: (data) => callBack(data),
      failCallback: (data) => failCallback(data)
    })
  },
  addBatchUserRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'addBatchUserRole', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteBatchUserRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchUserRole', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomRePermissionAsync (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomRePermissionAsync', data: data }, {
      successCallback: (data) => callBack(data)
    })
  }

}
