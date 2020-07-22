const path = require('path')
const join = require('path').join
const fs = require('fs')
const glob = require('glob')

const faceConfig = require('../faceConfig.js')
const theme = require('../src/style/theme/index')

exports.resolve = dir => {
  return path.join(__dirname, '..', dir)
}

const PAGES_PATH = []
faceConfig.coreModules.forEach(function (item) {
  PAGES_PATH.push(path.resolve(__dirname, '../src/scopes/core/' + item))
})
faceConfig.projectModules.forEach(function (item) {
  PAGES_PATH.push(path.resolve(__dirname, '../src/scopes/project/' + item))
})

//
faceConfig.docModule.forEach(function (item) {
  PAGES_PATH.push(path.resolve(__dirname, '../src/' + item))
})

let cachedMap
exports.cachedEntries = () => {
  return cachedMap
}
// 导出项目的所有页面
exports.entries = function () {
  let entryFiles = []
  PAGES_PATH.forEach(function (item) {
    entryFiles = entryFiles.concat(glob.sync(item + '/*.js'))
  })
  const map = {}
  entryFiles.forEach((filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
    map[filename] = {
      // page 的入口
      entry: filePath,
      // 模板来源
      template: filePath.replace('.js', '.html'),
      // 在 dist/index.html 的输出
      filename: filename + '.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', filename],
    }
  })
  cachedMap = map
  return map
}

exports.theme = theme(faceConfig.defaultTheme || 'default')

const chunksWhiteList = ['style', 'utils']
exports.extraChunks = (webpackConfig) => {
  const cacheGroups = {}
  const es = path.resolve(__dirname, '../node_modules/@yh/ta404-ui/es')
  findSync(es).forEach((dir) => {
    const dirName = dir.substring(dir.lastIndexOf('/') + 1)
    if (chunksWhiteList.indexOf(dirName) > -1) {
      return
    }
    cacheGroups['ta404-' + dirName] = {
      name: 'chunk-ta404-' + dirName,
      minChunks: 1,
      chunks: 'all',
      test (module) {
        return module.resource && (module.resource.indexOf('@yh/ta404-ui/es/' + dirName) >= 0)
      },
      priority: 21,
      enforce: true,
      reuseExistingChunk: true,
    }
  })
  webpackConfig.optimization.splitChunks({
    cacheGroups: cacheGroups,
  })
  return webpackConfig
}

exports.extractUtils = (webpackConfig) => {
  const cacheGroups = {}
  cacheGroups['async-validator'] = {
    name: 'async-validator',
    minChunks: 1,
    chunks: 'all',
    test (module) {
      return module.resource && (module.resource.indexOf('@yh/ta404-ui/es/utils/async-validator') >= 0||module.resource.indexOf('@yh\\ta404-ui\\es\\utils\\async-validator') >= 0)
    },
    priority: 21,
    enforce: true,
    reuseExistingChunk: true,
  }
  const es = path.resolve(__dirname, '../node_modules/@yh/ta404-ui/es/utils/js')
  findSync(es).forEach((dir) => {
    const dirName = dir.substring(dir.lastIndexOf('/') + 1)
    cacheGroups['ta404-utils-' + dirName] = {
      name: 'chunk-ta404-utils-' + dirName,
      minChunks: 1,
      chunks: 'all',
      test (module) {
        return module.resource && (module.resource.indexOf('@yh/ta404-ui/es/utils/js/' + dirName) >= 0||module.resource.indexOf('@yh\\ta404-ui\\es\\utils\\js\\' + dirName) >= 0)
      },
      priority: 21,
      enforce: true,
      reuseExistingChunk: true,
    }
  })
  webpackConfig.optimization.splitChunks({
    cacheGroups: cacheGroups,
  })
  return webpackConfig
}

/**
 * 获取指定目录下的所有目录的名称
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync (startPath) {
  const result = []

  function finder (path) {
    const files = fs.readdirSync(path)
    files.forEach((val, index) => {
      const fPath = join(path, val)
      const stats = fs.statSync(fPath)
      if (stats.isDirectory()) {
        result.push(fPath)
      }
      if (stats.isFile() && !val.indexOf('index.js')>=0 && !val.indexOf('style.js')>=0) {
        result.push(fPath)
      }
    })
  }

  finder(startPath)
  return result
}
