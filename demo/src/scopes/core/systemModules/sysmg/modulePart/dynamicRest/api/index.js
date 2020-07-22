const BASE_URL = 'dynamic/rest/'
const REST_USL = 'rest/'
export default {
  /* query dsList */
  queryDsList (_source, data, callBack) {
    let submitPara = {
      url: BASE_URL + 'queryDsList'
    }
    Base.submit(_source, submitPara, {
      successCallback: (data) => callBack(data)
    })
  },
  /* update */
  update (_source, data, callBack) {
    let submitParam = {
      url: BASE_URL + 'update',
      data: data
    }
    Base.submit(_source, submitParam, {
      successCallback: (data) => callBack(data)
    })
  },
  /* save */
  save (_source, data, callBack) {
    let submitParameter = {
      url: BASE_URL + 'add',
      data: data
    }
    Base.submit(_source, submitParameter, {
      successCallback: (data) => callBack(data)
    })
  },
  /* delete */
  deleteBatch (_source, data, callBack) {
    let submitParameter = {
      url: BASE_URL + 'delete',
      data: data
    }
    Base.submit(_source, submitParameter, {
      successCallback: (data) => callBack(data)
    })
  },
  /* update effective to effective */
  enable (_source, data, callBack) {
    let submitParameter = {
      url: BASE_URL + 'enable',
      data: data
    }
    Base.submit(_source, submitParameter, {
      successCallback: (data) => callBack(data)
    })
  },

  /* update effective to invalid */
  disable (_source, data, callBack) {
    let submitParameter = {
      url: BASE_URL + 'disable',
      data: data
    }
    Base.submit(_source, submitParameter, {
      successCallback: (data) => callBack(data)
    })
  },

  excutor (_source, restId, callBack) {
    let submitParameter = {
      url: REST_USL + restId
    }
    Base.submit(_source, submitParameter, {
      successCallback: (data) => callBack(data)
    })
  }

}
