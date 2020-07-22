const BASE_URL = '/appMg/appPageRestService/'

export default {
  /* 根据appid查询app下的页面,以树的结构返回(不含页面代码) */
  queryAllAppPagesByAppId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllAppPagesByAppId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryAllAppPagesWithContentByAppId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryAllAppPagesWithContentByAppId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  queryPageVoByPageId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryPageVoByPageId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 新增页面(不含模板代码) */
  addAppPage (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addAppPage', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 更新页面(可以传页面代码) */
  updateAppPageByVo (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateAppPageByVo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 根据id删除页面 */
  removeAppPageByPageId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeAppPageByPageId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量删除 */
  removeBatchAppPagesByPageIds (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeBatchAppPagesByPageIds', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 批量更新页面信息(适用于移动页面顺序时使用) */
  updateBatchAppPageByVos (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateBatchAppPageByVos', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 查询模板功能目录结构 */
  loadTemplateCatalog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'loadTemplateCatalog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 查询模板功能目录下的模板 */
  loadTemplateByCatalogId (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'loadTemplateByCatalogId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 查询模板内容content */
  getTemplateContent (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryTemplateContentByTemplateId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 查询模板功能目录下的模板 */
  getOnlineServiceList (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getOnlineServiceList', data: data, showPageLoading: false}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 保存服务模板 */
  savePageTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'savePageTemplateServiceRelation', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 保存在线开发到页面 */
  saveOnlineDevPage (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveOnlineDevPage', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  /* 保存在线开发的服务关系 */
  saveOnlineDevServer (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'saveOnlineDevServer', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
