const BASE_URL = '/org/sysmg/resourceManagementRestService/'
export default {
  /**
   * 查询功能资源详情
   * @param _source
   * @param param
   * @param successCall
   */
  queryResource (param, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'queryResourceByResourceID',
      data: {
        resourceId: param.resourceId,
        operationType: param.operationType
      }
    }, {
      successCallback: (result) => {
        successCall(result.data)
      }
    })
  },
  /**
   * 功能资源更新 (新增/修改)
   * @param _source
   * @param param
   * @param successCall
   */
  saveResource (param, successCall) {
    let url = ''
    if (param.operationType == '1') {
      url = BASE_URL + 'addResource'
    } else {
      url = BASE_URL + 'updateResourceByResourceId'
    }

    Base.submit(null, {
      url: url,
      data: param
    }, {
      successCallback: (result) => {
        message.success('保存成功', 2)
        successCall(result.data)
      }
    })
  },
  authRequestForResourceInfo (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'getResourceByResourceId', data: data }, {
      successCallback: (result) => callBack(result.data)
    })
  }
}
