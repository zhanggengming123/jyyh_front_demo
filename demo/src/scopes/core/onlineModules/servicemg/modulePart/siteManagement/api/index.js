const BASE_URL = '/sitemg/siteManagementRestService/'
export default {
  /* 查询表格 */
  querySiteByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'querySiteByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增 修改 */
  addOrEditSite (data, callBack) {
    let url = data.editType == '1' ? 'updateSite' : 'addSite'
    Base.submit(null, {url: BASE_URL + url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除 */
  deleteBatchSite (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchSite', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量禁用 启用 */
  disableOrEnableOrgs (data, callBack) {
    let url = data.type == '1' ? 'enableBatchOrgs' : 'disableBatchOrgs'
    Base.submit(null, {url: BASE_URL + url, data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 异步加载表格 */
  querySiteByParentId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'querySiteByParentId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
