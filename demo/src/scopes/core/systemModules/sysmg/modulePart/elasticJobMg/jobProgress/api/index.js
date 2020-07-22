const BASE_URL = '/jobmg/elasticjob/jobOperateRestService/'

export default {
  getJobProgress (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getJobProgress', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  refreshProgress (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refreshProgress', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  clearCache (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'clearCache', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
