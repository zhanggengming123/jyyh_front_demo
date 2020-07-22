const BASE_URL = '/examine/taExamineRestService/'
export default {

  /* 通过审核 */
  examineSomeone (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'examineSomeone', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  batchExamineSomeone (data, callBack) {
  Base.submit(null, {url: BASE_URL + 'batchExamineSomeone', data: data}, {
    successCallback: (data) => callBack(data)
  })
},
  /* 拒绝审核 */
  refusePass (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refusePass', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  batchRefusePass (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'batchRefusePass', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 详情 */
  queryExamineDetail (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryExamineDetail', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  queryTags (data, callBack) {
    Base.submit(null, {url: 'org/orguser/orgManagementRestService/' + 'queryTags', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  /* 获取用户标签 */
  queryTagByUserId (data, callBack) {
    Base.submit(null, {url: '/org/orguser/userManagementRestService/queryTagByUserId', data: data, showPageLoading: false}, {
      successCallback: (data) => callBack(data)
    })
  },

  queryOrgSettingTable (successCall) {
    Base.submit(null, {url: 'org/sysmg/manageableFieldsRestService/queryManageableFields', data: {type: '2'}}, {
      successCallback: (result) => successCall(result.data)
    })
  },
  queryUserSettingTable (successCall) {
    Base.submit(null, {url: 'org/sysmg/manageableFieldsRestService/queryManageableFields', data: {type: '1'}}, {
      successCallback: (result) => successCall(result.data)
    })
  },

  queryRePermissionByRoleId (data, callBack) {
    Base.submit(null, {url: 'org/authority/roleAuthorityManagementRestService/' + 'queryRePermissionByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUsePermissionByRoleId (data, callBack) {
    Base.submit(null, {url: 'org/authority/roleAuthorityManagementRestService/queryUsePermissionByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCustomUsePermissionByRoleId (data, callBack) {
    Base.submit(null, {url: 'org/authority/roleAuthorityManagementRestService/queryCustomUsePermissionByRoleId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  // 查询可管理的组织树列表
  querySimilarAuthority (data, callBack) {
    Base.submit(null, {url: '/org/authority/similarAuthorityManagementRestService/queryCurrentUserRePermission', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },

  examineChart (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'examineChart', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },

}
