export default {
  exportExcel (data, url) {
    Base.submit(null, {
      url: url,
      data: data,
      responseType: 'blob'
    }).then((data) => {
      let blob = new Blob([data.data], { type: 'application/xlsx;charset=utf-8' })
      var reader = new FileReader();
      reader.readAsText(blob, 'utf-8');
      reader.onload = function () {
        try {
          let resData = JSON.parse(reader.result) // resData即后台返回的原始数据
          if (resData.errors != null) {
            // parent.window.message.error可以拿到父窗口，也就是整个页面居中
            // 只有window.message.error的话会在iframe里边居中
            parent.window.message.error('下载失败!')
          }
        }catch (e) {
          if (window.navigator.msSaveBlob) { // 没有此判断的话，ie11下的导出没有效果
            window.navigator.msSaveBlob(blob, unescape(data.headers.filename))
          } else {
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = unescape(data.headers.filename) // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素

            window.URL.revokeObjectURL(href) // 释放掉blob对象
          }
        }
      }
    })
  },
}
