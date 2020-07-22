const BASE_URL = 'templateMg/templateMgRestService/'
export default {
  // 加载模板资源树
  loadTemplateCatalogTree (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'loadTemplateCatalogTree', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询模板列表
  listTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'queryTemplateByCatalogId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新建功能模块
  addTemplateCatalog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addTemplateCatalog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新模板功能目录名称
  updateTemplateCatalog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateTemplateCatalog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 移除功能模块
  removeTemplateCatalog (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeTemplateCatalog', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新增表单模版
  addFormTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addOnlineForm', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新增在线开发模版
  addOnlineDevTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addOnlineDev', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新增模板
  addTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addTemplate', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 上传模板
  uploadTemplate (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'uploadTemplate', data: data, isFormData: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除模板
  removeTempalte (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeTemplateByTemplateId', data: data, isFormData: true}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 更新模板
  updateTemplateName (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateTemplate', data: data, isFormData: true}, {
      successCallback: (data) => callBack(data)
    })
  }
}
