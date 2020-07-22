const BASE_URL = '/org/sysmg/tagManagementRestService/'
export default {
  // 查询标签组id查询标签
  queryTagByTagGroupId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryTag', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryTagByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryTagByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryAllTagGroup (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllTagGroup', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateBatchTagStatus (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchTagStatus', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除标签
  deleteBatchTag (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchTag', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addTag (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addTag', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新标签
  updateTag (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateTag', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
