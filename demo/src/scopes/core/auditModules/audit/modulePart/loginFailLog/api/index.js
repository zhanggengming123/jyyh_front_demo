
export default {

  loginFailChart (data, callBack) {
    Base.submit(null, { url: 'logMg/loginFailLog/taLoginFailLogRestService/' + 'loginFailChart', data: data }, {
      successCallback: (result) => callBack(result)
    })
  },
}
