const BASE_URL = '/org/authority/examinerAuthorityRestService/'
export default {
  // 查询审核角色

  // 根据角色ID查询可分配的账户
  queryUserNoWrapperByRoleId(data, callBack){
    let url = BASE_URL + "queryUserNoWrapperByRoleId";
    Base.submit(null, {url: url, data:data}, {
      successCallback: data => callBack(data)
    })
  },
  // 新增审核角色
  addExaminer(data, callBack) {
    let url = BASE_URL + 'addExaminer'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  // 修改审核角色
  updateExaminer(data, callBack) {
    let url = BASE_URL + 'updateExaminer'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  // 禁用审核角色
  unableExaminer(data, callBack) {
    let url = BASE_URL + 'unableExaminer'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  // 启用审核角色
  enableExaminer(data, callBack) {
    let url = BASE_URL + 'enableExaminer'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除审核角色
  deleteBatchExaminer(data, callBack) {
    let url = BASE_URL + 'deleteBatchExaminer'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询组织权限
  queryOrgAuth(data, callBack) {
    let url = BASE_URL + 'queryOrgAuth'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询当前角色的授权组织树
  queryOrgAuthTreeByAsync(data, callBack) {
    let url = BASE_URL + 'queryOrgAuthTreeByAsync'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  queryOrgTreeByAsync(data, callBack){
    let url = BASE_URL + 'queryOrgTreeByAsync'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 移除组织管理权限
  removeOrgAuth(data, callBack) {
    let url = BASE_URL + 'removeOrgAuth'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新增组织管理权限
  addOrgAuth(data, callBack) {
    let url = BASE_URL + 'addOrgAuth'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  addBatchExaminerUser(data, callBack){
    let url = BASE_URL + 'addBatchRoleUser'
    Base.submit(null, {url: url, data:data}, {
      successCallback: (data) => callBack(data)
    })
  },

  deleteBatchRoleUser(data, callBack){
    let url = BASE_URL + 'deleteBatchRoleUser'
    Base.submit(null, {url: url, data:data}, {
      successCallback: (data) => callBack(data)
    })
  },

  deleteBatchUserRole(data, callBack){
    let url = BASE_URL + 'deleteBatchUserRole'
    Base.submit(null, {url: url, data:data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addBatchUserRole(data, callback){
    let url = BASE_URL + 'addBatchUserRole'
    Base.submit(null, {url: url, data:data}, {
      successCallback: data => callback(data)
    })
  }
}
