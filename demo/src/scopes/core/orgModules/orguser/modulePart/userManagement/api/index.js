const BASE_URL = '/org/orguser/userManagementRestService/'
export default {
  /* 获取用户标签 */
  queryTagByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryTagByUserId', data: data, showPageLoading: false }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增 */
  addUser (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'addUser', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 编辑 */
  updateUserByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateUserByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 查头像 */
  queryAvatar (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryAvatar', data: data, showPageLoading: false }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除 */
  deleteBatchUserByUserIds (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'deleteBatchUserByUserIds', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 更改组织 */
  updateUserOrgByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateUserOrgByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 启用1 禁用2 解锁3 */
  changeEffectiveUnlock (data, callBack) {
    let url = ''
    if (data.type == 1) {
      url = 'updateBatchUserAbleByUserIds'
    } else if (data.type == 2) {
      url = 'updateBatchUserDisabledByUserIds'
    } else {
      url = 'updateBatchUserUnLockByUserIds'
    }
    Base.submit(null, { url: BASE_URL + url, data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 修改密码 */
  updateUserPwdByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateUserPwdByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 加载组织结构 */
  loadOrgTree (orgId, successCall) {
    Base.submit(null, { url: 'org/orguser/orgManagementRestService/getOrgByAsync', data: { orgId: orgId } }, {
      successCallback: (result) => successCall(result.data)
    })
  },
  /* 查询用户角色 */
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
    Base.submit(null, { url: 'org/orguser/userManagementRestService/queryEffectiveUser', data: param }, {
      successCallback: (result) => successCall(result.data)
    })
  },
  queryUserSettingTable (successCall) {
    Base.submit(null, { url: 'org/sysmg/manageableFieldsRestService/queryManageableFields', data: { type: '1' } }, {
      successCallback: (result) => successCall(result.data)
    })
  },
  getOrgUserByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getOrgUserByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryOrgInfoByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryOrgInfoByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  getUserOrgMultiConfig (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getUserOrgMultiConfig', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateOrgUserByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateOrgUserByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  authRequestForUserInfo (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getUserByUserId', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
