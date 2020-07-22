import isPlainObject from 'lodash/isPlainObject'
const BASE_URL = '/org/sysmg/resourceManagementRestService/'
export default {
  /**
   * 有参查询功能资源
   * @param _source
   * @param param
   * @param successCall
   */
  queryResourceList (param, successCall) {
    let data = {}
    if (typeof param == 'string') {
      if (param.trim() !== '') {
        data.name = param
        data.code = param
      }
    } else if (isPlainObject(param)) {
      Object.assign(data, param)
    } else {
      // 暂不允许不带条件的全部查询
      message.info('缺少参数, 操作无效')
    }
    Base.submit(null, {
      url: BASE_URL + 'queryTaResourceByParameters',
      data: data
    }).then((result) => {
      successCall(result.data)
    })
  },
  /**
   * 无参查询功能资源
   * @param _source
   * @param successCall
   */
  queryResourceListNoParam (successCall) {
    Base.submit(null, {
      url: BASE_URL + 'queryTaResourceByParameters'
    }).then((result) => {
      successCall(result.data)
    })
  },
  /**
   * 加载子节点资源
   * @param _source
   * @param record
   */
  loadChildResource (record, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'queryChildResource',
      data: {resourceId: record.resourceId}
    }, {
      successCallback: (result) => {
        if (!result.data.resourceList[0].children) {
          message.warning('当前功能资源不存在下级功能资源!', 2)
          return
        }
        successCall(result.data)
      }
    })
  },
  /**
   * 批量禁用资源
   * @param _source
   * @param resourceIds
   * @param successCall
   */
  disableResourceBatch (resourceIds, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'disabledResourceByResourceIds',
      data: {'resourceIds': resourceIds.join(',')}
    }).then((result) => {
      message.success('禁用资源成功', 2)
      successCall(result.data)
    })
  },
  /**
   * 批量启用资源
   * @param _source
   * @param resourceIds
   * @param successCall
   */
  enableResourceBatch (resourceIds, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'enabledResourceByResourceIds',
      data: {'resourceIds': resourceIds.join(',')}
    }, {
      successCallback: (result) => {
        message.success('启用资源成功', 2)
        successCall(result.data)
      }
    })
  },
  /**
   * 批量删除功能资源
   * @param _source
   * @param resourceIds
   * @param successCall
   */
  deleteResourceBatch (resourceIds, successCall) {
    Base.submit(null, {
      url: BASE_URL + 'deleteResourceByResourceIds',
      data: {'resourceIds': resourceIds.join(',')}
    }, {
      successCallback: (result) => {
        message.success('删除成功', 2)
        successCall(result.data)
      }})
  },
  /**
   * 删除功能资源
   * @param obj
   * @param type
   */
  deleteResource (paramObject, successCall) {
    if (paramObject.pResourceId == '0') {
      message.error('功能资源顶级节点不允许删除', 2)
      return
    }
    Base.submit(null, {
      url: BASE_URL + 'deleteResourceByResourceIds',
      data: {resourceIds: paramObject.resourceId}
    }, {
      successCallback: (result) => {
        message.success('删除成功', 2)
        successCall(result.data)
      }
    })
  },
  /**
   * 加载所属系统资源
   * @param _source
   * @param successCall
   */
  queryAllAccessSystem (successCall) {
    Base.submit(null, {
      url: BASE_URL + 'queryAllAccessSystem'
    }, {
      successCallback: (result) => {
        successCall(result.data)
      }
    })
  },
  queryResourceSettingTable (successCall) {
    Base.submit(null, {
      url: 'org/sysmg/manageableFieldsRestService/queryManageableFields',
      data: {type: '3'}
    }, {
      successCallback: (result) => {
        successCall(result.data)
      }
    })
  }
}
