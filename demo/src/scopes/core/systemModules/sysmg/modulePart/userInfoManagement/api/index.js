const BASE_URL = '/org/sysmg/manageableFieldsRestService/'
export default {
  querySettingTable (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryManageableFields', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  saveDefaultSetting (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveDefaultManageableFields', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  saveSettingTable (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateManageableFieldsDetailByFieldId', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  },
  saveAllSettingTable (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateManageableFieldsByFieldsId', data: data}, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
