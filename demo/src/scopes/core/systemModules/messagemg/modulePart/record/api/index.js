const BASE_URL = "message/"
export default {
  queryUserMessageNoRead(data, callBack) {
    let param = {
      url: BASE_URL + "record/queryUserMessageNoRead",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUserMessageAll(data, callBack) {
    let param = {
      url: BASE_URL + "record/queryUserMessageAll",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  queryUserMessageSend(data, callBack) {
    let param = {
      url: BASE_URL + "record/queryUserMessageSend",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  readNotices(data, callBack) {
    let param = {
      url: BASE_URL + "readNotices",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  },
  queryNoticeFiles(data, callBack) {
    let param = {
      url: BASE_URL + "queryNoticeFiles",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (data) => callBack(data)
    })
  }
}
