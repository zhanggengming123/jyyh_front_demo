const BASE_URL = '/dictmg/dictMgRestService/'
export default {
  // query dict type
  queryType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除字典
  deleteDictByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryDictByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  saveDict (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveDict', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新字典
  updateDict (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateDict', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 开启
  startDictByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'startDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 禁用
  stopDictByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'stopDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  refreshDictCacheByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refreshDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  saveType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除字典
  deleteBatchDict (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchDict', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  stopBatchDict (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'stopBatchDict', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  startBatchDict (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'startBatchDict', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  refreshDictByType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refreshDictByType', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 添加自定义组织类型
  queryDictContent (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryDictContent', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryDictInfo (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryDictInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryDictAuthorityList(data, callBack){
    let url = BASE_URL + 'queryAuthorityList'
    Base.submit(null, {url: url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
