const BASE_URL = '/org/authority/authorityAgentRestService/'
export default {
  queryAllAgentRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryAllAgentRole', data: { roleType: '03' } }, {
      successCallback: (result) => callBack(result.data)
    })
  },

  // 异步加载
  queryCustomUsePermissionAsync (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomUsePermissionAsync', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  updateAgentRoleAuthority (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateAgentRoleAuthority', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 加载
  loadAuthorityTree (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryAgentRoleAuthority', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 批量删除代理角色
  batchDeleteAgentRole (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchAgentRole', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 查询人员权限 根据userId获取当前用户可授权的菜单权限
  queryUsePermissionByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryUsePermissionByUserId', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 根据userId获取当前用户可授权的授权对象权限
  queryCustomUsePermissionByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryCustomUsePermissionByUserId', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 加载组织结构
  loadOrgTree (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getOrgByAsync', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
  // 查询用户角色
  queryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam }, successCall) {
    const param = {
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
    Base.submit(null, { url: BASE_URL + 'queryReAgentUsersByOrgId', data: param }, {
      successCallback: (result) => successCall(result.data)
    })
  },
  // 新增代理角色
  addAuthorityAgent (param, callBack) {
    const data = {
      userId: param.targetUserId,
      resourceIds: param.authoritySelectArray.join(','),
      customResourceIds: param.customResourceIds,
      customNeedChildIds: param.customNeedChildIds,
      customHalfNeedIds: param.customHalfNeedIds,
      effectTime: param.effectiveTime,
      theAgent: param.theAgent
    }
    Base.submit(null, { url: BASE_URL + 'addAgentRole', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
