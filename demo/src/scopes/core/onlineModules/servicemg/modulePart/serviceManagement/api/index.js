const BASE_URL = 'onlinedev/onlineServiceManagementRestService/'
export default {
  /* 查询在线服务项列表 */
  queryOnlineServiceName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryOnlineServiceName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增在线服务项 */
  addOnlineServiceName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addOnlineServiceName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 更新在线服务项 */
  updateOnlineServiceName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateOnlineServiceName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除服务项 */
  deleteBatchOnlineServiceName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchOnlineServiceName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 通过条件查询在线服务列表信息 */
  queryOnlineServiceByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryOnlineServiceByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增在线服务信息 */
  addOnlineService (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addOnlineService', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 更新在线服务信息 */
  updateOnlineService (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateOnlineService', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除在线服务信息列表 */
  deleteBatchOnlineService (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchOnlineService', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
