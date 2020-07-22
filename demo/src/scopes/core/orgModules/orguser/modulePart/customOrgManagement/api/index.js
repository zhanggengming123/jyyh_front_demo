const BASE_URL = '/org/orguser/customOrgManagementRestService/'
export default {
  // 通过parentid查询组织信息
  queryCustomOrgByParentId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCustomOrgByParentId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 根据条件查询
  queryCustomOrgByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCustomOrgByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询标签组id查询标签
  queryCustomOrgTypeName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCustomOrgTypeName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 根据条件查询组织类型
  queryCustomOrgTypeNameByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCustomOrgTypeNameByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomOrgByValidId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCustomOrgByValidId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除标签
  deleteBatchCustomOrg (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchCustomOrg', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateBatchCustomOrgStatus (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchCustomOrgStatus', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量添加自定义组织人员
  addBatchCustomOrgUser (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addBatchCustomOrgUser', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量删除自定义组织人员
  deleteBatchCustomOrgUser (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchCustomOrgUser', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addCustomOrg (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addCustomOrg', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateCustomOrg (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateCustomOrg', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新标签
  queryAllTaOrg (data, callBack) {
    Base.submit(null, {url: 'org/orguser/orgManagementRestService/getOrgByAsync', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询组织人员信息
  queryOrgUser (data, callBack) {
    Base.submit(null, {url: 'org/orguser/userManagementRestService/queryUserByConditon', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryBatchUserByCustomOrgId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryBatchUserByCustomOrgId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryBatchUserByOrgId (data, callBack) {
    Base.submit(null, {url: 'org/orguser/userManagementRestService/queryEffectiveUser', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteBatchCustomOrgTypeName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchCustomOrgTypeName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 添加自定义组织类型
  addCustomOrgTypeName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addCustomOrgTypeName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateCustomOrgTypeName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateCustomOrgTypeName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
