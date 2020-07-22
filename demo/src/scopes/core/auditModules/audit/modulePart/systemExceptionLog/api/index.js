const BASE_URL = '/logmg/exceptionlog/serverExceptionLogRestService/'
export default {
  deleteExceptionLogByLogId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteExceptionLogByLogId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getDetalExceptionLog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getDetalExceptionLog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  batchDeleteExceptionLog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'batchDeleteExceptionLog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  exceptionChart (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'exceptionChart', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
