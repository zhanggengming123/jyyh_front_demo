const BASE_URL = '/org/sysmg/orgOpLogRestService/'
export default {
  getChangeContent (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getChangeContent', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  opLogChart (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'opLogChart', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
}
