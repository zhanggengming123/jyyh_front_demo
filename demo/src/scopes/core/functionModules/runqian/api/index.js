const BASE_URL = '/tarunqianresource/taRunqianResourceRestService/'
export default {
  editRunqianResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'editRunqianResource', data: data, isFormData: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  addRunqianResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addRunqianResource', data: data, isFormData: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  delRunqianResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'delRunqianResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
