const BASE_URL = 'fileResource/fileResourceManageRestService/'
export default {
  // 加载静态资源树
  loadFileResourceTree (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'loadFileResourceTree', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 查询文件列表
  listFileResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'listFileResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新建文件夹
  addFileDirectoryResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addFileDirectoryResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新建文件（通过上传）
  addFileResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addFileResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 新建文件（通过在线创建）
  addFileResourceText (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addFileResourceText', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除文件
  removeFileResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeFileResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  // 删除文件夹
  removeFileDirectoryResource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'removeFileDirectoryResource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
