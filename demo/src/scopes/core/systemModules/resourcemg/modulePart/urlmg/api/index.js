const BASE_URL = "org/sysmg/url/"
export default {
  queryUrlByParam(data, callBack) {
    let param = {
      url: BASE_URL + "queryByParam",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  queryNamespace(data, callBack){
    let param = {
      url: BASE_URL + "queryNamespace",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data)=> callBack(data)
    })
  },
  queryUrlByNamespace(data, callBack){
    let param = {
      url: BASE_URL +"queryUrlByNamespace",
      data: data
    }
    Base.submit(null, param, {
      successCallback: data => callBack(data)
    })
  },
  saveUrl(data, callBack){
    let param = {
      url: BASE_URL + "saveUrl",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },

  updateUrl(data, callBack){
    let param = {
      url: BASE_URL + "updateUrl",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },

  deleteUrl(data, callBack){
    let param = {
      url: BASE_URL + 'deleteBatchUrl',
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  disableUrl(data, callBack){
    let param = {
      url: BASE_URL + 'disableBatchUrl',
      data: data
    }
    Base.submit(null, param, {
      successCallback: data => callBack(data)
    })
  },
  enableUrl(data, callBack){
    let param = {
      url: BASE_URL + 'enableBatchUrl',
      data: data
    }
    Base.submit(null, param, {
      successCallback: data => callBack(data)
    })
  },



}
