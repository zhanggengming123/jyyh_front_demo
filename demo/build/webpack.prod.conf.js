const merge = require('webpack-merge')
const webpack = require('webpack')
// const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const utils = require('./utils')

// 启用gzip
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const zopfli = require('@gfx/zopfli')
// const BrotliPlugin = require('brotli-webpack-plugin')
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

const base = require('./webpack.base.conf').base

// 此处放置production模式下的webpack配置，请注意，此处的配置会直接merge @vue/cli 的默认配置
// 请尽量使用`chainWebpack`来对webpack进行配置
// 此处仅作为兼容使用
exports.prod = merge(base, {
  // 提取vue/axios/vuex/vue-router为external资源
  externals: {
    // vue: 'Vue',
    // 'vue-router': 'VueRouter',
    // vuex: 'Vuex',
    // axios: 'axios',
  },
  plugins: [
  // 提取vue/axios/vuex/vue-router为external资源
  // new HtmlWebpackTagsPlugin({ scripts: ['lib/vue.min.js'], append: true, }),
  // new HtmlWebpackTagsPlugin({ scripts: ['lib/vuex.min.js'], append: true, }),
  // new HtmlWebpackTagsPlugin({ scripts: ['lib/axios.min.js'], append: true, }),
  // new HtmlWebpackTagsPlugin({ scripts: ['lib/vue-router.min.js'], append: true, })
  // 开启gzip压缩
  // new CompressionWebpackPlugin({
  //   algorithm (input, compressionOptions, callback) {
  //     return zopfli.gzip(input, compressionOptions, callback)
  //   },
  //   compressionOptions: {
  //     numiterations: 15
  //   },
  //   minRatio: 0.99,
  //   test: productionGzipExtensions
  // }),
  // 开启Zopfli压缩（比gzip更好）
  // new BrotliPlugin({
  //   test: productionGzipExtensions,
  //   minRatio: 0.99
  // })
  ],
})

exports.prodChain = (webpackConfig) => {
  // build时修改文件大小限制
  webpackConfig.performance.hints('warning').maxEntrypointSize(50000000).maxAssetSize(30000000).assetFilter((assetFilename) => {
    return assetFilename.endsWith('.js')
  })

  // 这是一个临时的措施来缓解build的时候报大量warning的问题，具体解决方法还需要排查UI中的less文件的样式引入顺序
  webpackConfig.plugin('extract-css') && webpackConfig.plugin('extract-css').tap(args => {
    const options = args[0]
    options.ignoreOrder = true
    return args
  })

  // 优化输出
  webpackConfig.plugin('optimize-module-concatenation') && webpackConfig.plugin('optimize-module-concatenation')
    .use(webpack.optimize.ModuleConcatenationPlugin)

  // 兼容IE9：IE9下可能会出现css文件过长而导致截断的问题
  webpackConfig
    .plugin('css-split-IE9')
    .use(CSSSplitWebpackPlugin, [
      {
        size: 3000,
        filename: 'css/[name]-[part].[ext]',
      }
    ])

  // 补全html插入资源
  webpackConfig.plugin('insert-preload').use(require.resolve('./plugins/insertPreload'), [
    {
      defer: true,
      runtime: ['c_', 'r_'],
    }
  ])

  // 提取vue/axios/vuex/vue-router为external资源
  webpackConfig.plugins.has('copy') && webpackConfig.plugin('copy').tap(args => {
    // args[0].push({
    //   from: 'node_modules/vue/dist/vue.min.js',
    //   to: 'lib',
    //   toType: 'dir',
    // })
    // args[0].push({
    //   from: 'node_modules/axios/dist/axios.min.js',
    //   to: 'lib',
    //   toType: 'dir',
    // })
    // args[0].push({
    //   from: 'node_modules/vuex/dist/vuex.min.js',
    //   to: 'lib',
    //   toType: 'dir',
    // })
    // args[0].push({
    //   from: 'node_modules/vue-router/dist/vue-router.min.js',
    //   to: 'lib',
    //   toType: 'dir',
    // })
    return args
  })

  // 移除moment的除zh-cn之外的语言包
  webpackConfig
    .plugin('ignore')
    .use(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
    )

  // 打包分析
  // webpackConfig.plugin('webpack-report').use(BundleAnalyzerPlugin, [
  //   {
  //     analyzerMode: 'static',
  //     reportFilename: '../report.html'
  //   }
  // ])
  // 对ta404-ui进行更大的分割，即每个组件一个js文件加载
  // webpackConfig = require('./utils').extraChunks(webpackConfig)
  // webpackConfig = require('./utils').extractUtils(webpackConfig)

  // cache-control
  Object.keys(utils.cachedEntries()).forEach(name => {
    webpackConfig.plugin(`html-${name}`).tap(args => {
      const newArgs = {
        ...args[0],
        meta: {
          cacheControl1: { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate', },
          cacheControl2: { 'http-equiv': 'Pragma', content: 'no-cache', },
          cacheControl3: { 'http-equiv': 'Expires', content: '0', },
        },
      }
      return [newArgs]
    })
  })

  // 修改terser配置
  webpackConfig.optimization.minimizer('terser').tap((args) => {
    args[0].terserOptions.compress.drop_console = true
    args[0].terserOptions.compress.drop_debugger = false
    return args
  })

  webpackConfig.optimization.splitChunks({
    maxSize: 5000000,
    cacheGroups: {
      vendors: {
        name: 'chunk-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial',
        reuseExistingChunk: true,
      },
      common: {
        name: 'chunk-common',
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true,
      },
      ta404: {
        name: 'chunk-ta404',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]es/,
        priority: 20,
        maxSize: 900000,
        enforce: true,
        reuseExistingChunk: true,
      },
      // 'ta404-utils': {
      //   name: 'chunk-ta404-utils',
      //   minChunks: 1,
      //   chunks: 'all',
      //   test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]es[\\/]utils[\\/]/,
      //   priority: 21,
      //   enforce: true,
      //   reuseExistingChunk: true,
      // },
      // 'ta404-locale': {
      //   name: 'chunk-ta404-locale',
      //   minChunks: 1,
      //   chunks: 'all',
      //   test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]es[\\/].*[\\/]locale[\\/]/,
      //   priority: 22,
      //   enforce: true,
      //   reuseExistingChunk: true,
      // },
      'ta404-dist': {
        name: 'chunk-ta404-dist',
        chunks: 'all',
        test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]dist/,
        priority: 21,
        maxSize: 1,
        enforce: true,
        reuseExistingChunk: true,
      },
      icons: {
        name: 'chunk-icons',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]@yh[\\/]icons-svg/,
        priority: 20,
        enforce: true,
        reuseExistingChunk: true,
      },
      'core-js': {
        name: 'chunk-core-js',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]core-js/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      antd: {
        name: 'chunk-antd',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/](@ant-design|tinycolor2)/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      moment: {
        name: 'chunk-moment',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]moment/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      jquery: {
        name: 'chunk-jquery',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]jquery/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      'element-ui': {
        name: 'chunk-element-ui',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]element-ui/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      faceConfig: {
        name: 'chunk-faceConfig',
        minChunks: 1,
        chunks: 'all',
        test: /faceConfig\.js/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      'wang-editor': {
        name: 'chunk-wang-editor',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]wangeditor/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      lodash: {
        name: 'chunk-lodash',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]lodash/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      'z-render': {
        name: 'chunk-z-render',
        minChunks: 1,
        chunks: 'all',
        test: /[\\/]node_modules[\\/]zrender/,
        priority: 22,
        enforce: true,
        reuseExistingChunk: true,
      },
      'vue-modules': {
        name: 'chunk-vue-modules',
        minChunks: 1,
        chunks: 'all',
        test (module) {
          return module.resource && (module.resource.indexOf('vuex') >= 0 || module.resource.indexOf('vue-grid-layout') >= 0 || module.resource.indexOf('vue-draggable-resizable-gorkys') >= 0 || module.resource.indexOf('vue-bus') >= 0 || module.resource.indexOf('axios') >= 0)
        },
        priority: 24,
        enforce: true,
        reuseExistingChunk: true,
      },
    },
  })
  return webpackConfig
}
