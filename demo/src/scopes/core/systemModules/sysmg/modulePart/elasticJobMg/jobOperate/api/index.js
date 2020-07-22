const BASE_URL = '/jobmg/elasticjob/jobOperateRestService/'
export default {
  getJobInfo (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getJobInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobDetailInfo (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getJobDetailInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  saveJobDetailInfo (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveJobDetailInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
