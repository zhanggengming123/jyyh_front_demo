const BASE_URL = '/logmg/logconfig/logConfigRestService/'
export default {
  getLogConfig (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getLogConfig', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  configLevelAndAppenderType (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'configLevelAndAppenderType', data: data}, {
      successCallback: (data) => callBack(data),
      failCallback: (data) => callBack(data)
    })
  },
  configFileNamePattern (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'configFileNamePattern', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteLogConfigByName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteLogConfigByName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addLogConfig (form, data, callBack) {
    Base.submit(form, {url: BASE_URL + 'addLogConfig', data: data, autoValid: true}, {
      successCallback: (data) => callBack(data)
    }).then((data) => {}).catch((error) => {})
  }
}
