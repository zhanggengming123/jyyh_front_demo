const BASE_URL = '/org/sysmg/customResourceManagementRestService/'
export default {
  queryALLTaResourceCategory (data, callBack) {
    Base.submit(null, {url: 'org/sysmg/resourceCategoryManagementRestService/queryALLTaResourceCategory', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryALLTaCustomResourceTreeByCategoryId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryALLTaCustomResourceTreeByCategoryId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryAccessSystemByParam (data, callBack) {
    Base.submit(null, {url: 'org/sysmg/accessSystemManagementRestService/queryEffectiveAccessSystem', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryALLTaCustomResourceParent (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryALLTaCustomResourceParent', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addTaResourceCategory (data, callBack) {
    Base.submit(null, {url: 'org/sysmg/resourceCategoryManagementRestService/addTaResourceCategory', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateTaResourceCategoryByCategoryId (data, callBack) {
    Base.submit(null, {url: 'org/sysmg/resourceCategoryManagementRestService/updateTaResourceCategoryByCategoryId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addTaCustomResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addTaCustomResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateTaCustomResourceByCustomResourceId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateTaCustomResourceByCustomResourceId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteTaCustomResourceByCustomResourceId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteTaCustomResourceByCustomResourceId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteTaResourceCategoryByCategoryId (data, callBack) {
    Base.submit(null, {url: 'org/sysmg/resourceCategoryManagementRestService/deleteTaResourceCategoryByCategoryId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryALLTaCustomResourceTree (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryALLTaCustomResourceTree', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
