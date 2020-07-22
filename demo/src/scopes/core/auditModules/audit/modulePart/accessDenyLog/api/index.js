const BASE_URL = 'logMg/accessLog/taAccessDenyLogRestService/'
export default {
  getAnalysisAccessDenyInfo (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'analysisAccessDenyInfoInterval', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  },
}
