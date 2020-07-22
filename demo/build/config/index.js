'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
const faceConfig = require('../../faceConfig.js')
let targetUrl = faceConfig.devServer

process.env.RUN_ENV === 'mock' && (targetUrl = 'http://localhost:36742/')

exports.proxy = () => {
  // 动态设置代理路径
  let proxyTable = {}
  const pathRewrite = {}
  if (process.env.RUN_ENV === 'mock' || process.env.RUN_ENV === 'server') {
    proxyTable = {}
    pathRewrite['^' + faceConfig.basePath] = '/'
    proxyTable[faceConfig.basePath] = {
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        ...pathRewrite
      }
    }
  } else {
    proxyTable = undefined
  }
  return proxyTable
}
