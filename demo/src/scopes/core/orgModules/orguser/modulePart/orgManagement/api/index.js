const BASE_URL = '/org/orguser/orgManagementRestService/'
export default {
  /* 查询表格 */
  queryAllOrgByOrgId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllOrgByOrgId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 编辑时查询信息 */
  queryTaOrgByOrgId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryTaOrgByOrgId', data: data, showPageLoading: false}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 人员选择 */
  queryAllTaOrg (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllTaOrg', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 点击树显示用户 */
  queryBatchUserByOrgId (data, callBack) {
    Base.submit(null, {url: 'org/orguser/userManagementRestService/queryBatchUserByOrgId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增 修改 */
  addOrUpdateTaOrg (form, data, callBack) {
    let url = ''
    if (data.editType == '1') {
      url = 'addTaOrg'
    } else {
      url = 'updateTaOrgByOrgId'
    }

    Base.submit(form, {url: BASE_URL + url, data: data, autoValid: true}, {
      successCallback: (data) => callBack(data),
      failCallback: (data) => callBack(data)
    })
  },
  /* 批量删除 */
  deleteBatchOrgs (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchOrgs', data: data, autoValid: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量禁用 启用 */
  disableOrEnableOrgs (data, callBack) {
    let url = ''
    if (data.type == '1') {
      url = 'enableBatchOrgs'
    } else {
      url = 'disableBatchOrgs'
    }
    Base.submit(null, {url: BASE_URL + url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 异步加载表格 */
  queryChildOrgByOrgId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryChildOrgByOrgId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 删除 */
  deleteOrgByOrgId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteOrgByOrgId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 加载组织结构 */
  loadOrgTree (orgId, successCall) {
    Base.submit(null, {url: BASE_URL + 'getOrgByAsync', data: {orgId: orgId}}, {
      successCallback: (result) => successCall(result.data)
    })
  },
  /* 查询用户角色 */
  queryUserList ({orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam}, successCall) {
    let param = {
      orgId: orgId,
      userId: userId,
      showChildUser: includeChild ? 1 : 0,
      pageSize: pageSize,
      pageNumber: pageNum,
      name: searchVal
    }
    if (searchType) {
      param[searchType] = searchParam
    }
    Base.submit(null, {url: 'org/orguser/userManagementRestService/queryEffectiveUser', data: param}, {
      successCallback: (result) => successCall(result.data)
    })
  },
  queryOrgSettingTable (successCall) {
    Base.submit(null, {url: 'org/sysmg/manageableFieldsRestService/queryManageableFields', data: {type: '2'}}, {
      successCallback: (result) => successCall(result.data)
    })
  },
  authRequestForOrgInfo (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getOrgByOrgId', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
