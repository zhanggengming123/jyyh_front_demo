const BASE_URL = '/org/sysmg/accessSystemManagementRestService/'
export default {
  /* 新增保存 */
  addTaAccessSystem (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addTaAccessSystem', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 删除 */
  deleteTaAccessSystemById (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteTaAccessSystemById', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除 */
  deleteBatchTaAccessSystemById (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchTaAccessSystemById', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 禁用启用 */
  updateTaAccessSystemById (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateTaAccessSystemById', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
