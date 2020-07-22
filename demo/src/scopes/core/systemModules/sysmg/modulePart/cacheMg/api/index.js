const BASE_URL = '/cacheMg/cacheMgRestService/'
export default {
  queryKeyList (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryKeyList', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // TODO 查询缓存列表,后续会更改
  queryCacheNameList (data, callBack) {
    Base.submit(null, {url: '/cacheMg/cacheMgRestService', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryCacheContent (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCacheContent', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询缓存节点
  queryCacheNodeList (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryCacheNodeList', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
