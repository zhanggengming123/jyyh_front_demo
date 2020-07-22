const BASE_URL = '/appMg/appMgRestService/'
export default {
  /* 查询表格 */
  queryAppVosByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAppVosByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增 */
  addApp (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addApp', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 修改 */
  updateAppByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateAppByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 删除 */
  removeAppById (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeAppById', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
