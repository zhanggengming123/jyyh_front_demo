const BASE_URL = '/org/sysmg/workbenchRestService/'
export default {
  queryRoleListByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryRoleListByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryLastChooseWorkbench (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryLastChooseWorkbench', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUserWorkbenchByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryUserWorkbenchByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryRoleWorkbenchByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryRoleWorkbenchByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryResourceEffectiveByUserId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryResourceEffectiveByUserId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  queryResourceEffectiveByRoleId (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryResourceEffectiveByRoleId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  saveUserWorkbench (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'saveUserWorkbench', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  saveRoleWorkbench (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'saveRoleWorkbench', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  saveLastChooseWorkbenchData(data){
    Base.submit(null, { url: BASE_URL + 'saveLastChooseWorkbenchData', data: data })
  },
  // 查询用户上次的登录记录信息,add by wanggan
  queryCurrentUserLastLoginLog(data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCurrentUserLastLoginLog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
