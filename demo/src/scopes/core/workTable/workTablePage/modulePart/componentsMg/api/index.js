const BASE_URL = '/org/sysmg/WorkbenchManageRestService/'
const RESOURCE_URL = '/org/sysmg/resourceManagementRestService/'
export default {
  queryDefaultValue(data, callBack){
    Base.submit(null, { url: BASE_URL + 'queryDefaultValue', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateStatus (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'updateStatus', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  addResource (data, callBack) {
    Base.submit(null, { url: RESOURCE_URL + 'addResource', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  updateResourceByResourceId (data, callBack) {
    Base.submit(null, { url: RESOURCE_URL + 'updateResourceByResourceId', data: data }, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteResourceByResourceIds(data, callBack){
    Base.submit(null, { url: RESOURCE_URL + 'deleteResourceByResourceIds', data: data }, {
      successCallback: (data) => callBack(data)
    })
  }
}
