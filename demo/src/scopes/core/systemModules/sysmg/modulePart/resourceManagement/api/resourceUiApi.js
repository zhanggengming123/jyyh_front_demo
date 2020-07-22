const BASE_URL = '/org/sysmg/resourceManagementRestService/'
export default {
  /**
   * 查询功能资源界面元素信息
   * @param _source
   * @param resourceId
   * @param successCall
   */
  queryResourceUi (resourceId, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'queryTaResourceUi',
      data: {resourceId: resourceId}
    }, {
      successCallback: (result) => {
        successCall(result.data)
      }
    })
  },
  /**
   * 界面元素保存成功
   * @param _source
   * @param param
   * @param successCall
   */
  saveResourceUi (param, successCall) {
    let url = '', desc = ''
    if (param.elementDataAddOrEdit == '1') {
      url = BASE_URL + 'addTaResourceUi'
      desc = '添加'
    } else if (param.elementDataAddOrEdit == '2') {
      url = BASE_URL + 'updateTaResourceUi'
      desc = '修改'
    }

    let submitParameter = {
      url: url,
      data: {
        pageElementId: param.pageElementId,
        resourceId: param.resourceId,
        elementName: param.elementName,
        elementId: param.elementId,
        code: param.code,
        authorityPolicy: param.authorityPolicy
      }
    }

    Base.submit(null, submitParameter, {
      successCallback: (result) => {
        message.success('表单元素' + desc + '成功')
        successCall(result.data)
      }
    })
  },
  /**
   * 删除界面元素资源
   * @param _source
   * @param param
   * @param successCall
   */
  deleteResourceUi (param, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'deleteTaResourceUi',
      data: {
        pageElementIds: param.pageElementId,
        elementId: param.elementId,
        resourceId: param.resourceId
      }
    }, {
      successCallback: (result) => {
        message.success('表单元素删除成功')
        successCall(result.data)
      }
    })
  },

  queryUrlByParam(data, callBack) {
    let param = {
      url: "org/sysmg/url/queryByParam",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (result) => callBack(result.data)
    })
  },
  queryNamespace(data, callBack){
    let param = {
      url: "org/sysmg/url/queryNamespace",
      data: data
    }
    Base.submit(null, param, {
      successCallback: (result)=> callBack(result.data)
    })
  },
  queryUrlByNamespace(data, callBack){
    let param = {
      url: "org/sysmg/url/queryUrlByNamespace",
      data: data
    }
    Base.submit(null, param, {
      successCallback: result => callBack(result.data)
    })
  },
}
