const BASE_URL = 'org/orguser/areaManagementRestService/'
export default {
  // 查询可管理的组织树列表
  queryAllArea (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllArea', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryAreaByCondition (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAreaByCondition', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新标签
  addArea (form, data, callBack) {
    Base.submit(form, {url: BASE_URL + 'addArea', data: data, autoValid: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量删除行政区划通过区域id列表
  deleteBatchAreaByAreaIds (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteBatchAreaByAreaIds', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 批量更新区域状态信息
  updateBatchAreaStatus (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchEffectiveByAreaIdPath', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateArea (form, data, callBack) {
    Base.submit(form, {url: BASE_URL + 'updateArea', data: data, autoValid: true}, {
      successCallback: (data) => callBack(data)
    })
  }
}
