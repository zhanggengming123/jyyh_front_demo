const utils = require('./utils')

exports.base = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': utils.resolve('src'),
      // 添加读取路径
      pages: utils.resolve('src/pages'),
      common: utils.resolve('src/common'),
      faceConfig: utils.resolve('faceConfig.js'),
      '@common': utils.resolve('src/common'),
      '@projectCommon': utils.resolve('src/projectCommon'),
    },
    modules: [
      'node_modules',
      'node_modules/@yh'
    ],
  },
}

// eslint-disable-next-line no-unused-vars
exports.baseChain = (webpackConfig) => {
  // 通过webpackConfig来修改webpack的配置
  // 复制pdfjs到dist目录
  webpackConfig.plugins.has('copy') && webpackConfig.plugin('copy').tap(args => {
    args[0].push({
      from: 'node_modules/@yh/ta404-ui/static/pdfjs',
      to: 'static/pdfjs',
      toType: 'dir',
    })
    return args
  })

  // 修改vue-loader的options
  // 修改vue-template-compiler的whitespace配置为preserve：inline-block布局的按钮之间会显示一个小的空格
  // webpackConfig.module.rule('vue').use('vue-loader').tap(options => {
  //   Object.assign(options, {
  //     compilerOptions: {
  //       whitespace: 'preserve'
  //     }
  //   })
  //   return options
  // })

  return webpackConfig
}
