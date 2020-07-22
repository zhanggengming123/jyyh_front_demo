const path = require('path')

const utils = require('./build/utils')
const faceConfig = require('./faceConfig')

// 旧式的webpack 配置方式
const webpackConfigure = process.env.NODE_ENV !== 'production' ? require('./build/webpack.dev.conf').dev : require('./build/webpack.prod.conf').prod

// 新的webpack 配置方式
// dev/prod模式均需要引入的webpack配置
const baseChain = require('./build/webpack.base.conf').baseChain
// dev模式下的webpack-chain配置
const devChain = require('./build/webpack.dev.conf').devChain
// prod模式下的webpack-chain配置
const prodChain = require('./build/webpack.prod.conf').prodChain

const config = require('./build/config')

// 主机及端口配置佛祖保佑
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// vue/cli 配置：https://cli.vuejs.org/zh/config
module.exports = {
  // 设置public path，即上下文
  // 这个选项在dev模式下为'/'，prod模式下为faceConfig.js中的context
  publicPath: process.env.NODE_ENV === 'development' ? '/' : `/${faceConfig.context}`,
  outputDir: 'dist',
  assetsDir: '',
  indexPath: 'index.html',
  filenameHashing: true,
  pages: utils.entries(),
  lintOnSave: false, // 可选值：true/false/warning/default/error
  runtimeCompiler: true,
  // 这个选项用于将`node_modules`中的模块加入babel的build过程，实现第三方库的兼容。IE浏览器不兼容时使用。
  // 如果需要在dev模式下测试IE兼容性，则需要将下面的三元表达式注释
  transpileDependencies: process.env.NODE_ENV !== 'production' ? [] : [
    '@ant-design/icons',
    '@wcjiang/notify',
    '@yh/icons-svg',
    '@yh/ta404-ui',
    'axios',
    'clipboard',
    'element-ui',
    'moment',
    'v-jsoneditor',
    'vue-bus',
    'vue-cookies',
    'vue-grid-layout',
    'vue-router',
    'vue-cookies',
    'vuedraggable',
    'vuex',
    'webpack-dev-server'
  ],
  productionSourceMap: false,
  // crossorigin: '',
  integrity: false,
  configureWebpack: webpackConfigure,
  chainWebpack: (webpackConfig) => {
    webpackConfig = baseChain(webpackConfig)

    // dev
    if (process.env.NODE_ENV === 'development') {
      webpackConfig.resolve.symlinks(true)
      webpackConfig = devChain(webpackConfig)
    }

    // prod
    if (process.env.NODE_ENV === 'production') {
      webpackConfig = prodChain(webpackConfig)
    }

    return webpackConfig
  },
  css: {
    requireModuleExtension: true,
    // 测试IE9的时候需要设置为true
    // extract: true, // dev:false,production:true;自动设置
    // sourceMap: true,
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        // 主题替换
        modifyVars: utils.theme,
      },
      postcss: {
        plugins: [
          require('autoprefixer')({ // 配置使用 autoprefixer
            overrideBrowserslist: ['last 3 versions', 'not ie <= 8'], // 记得这里要把 browsers 改为 overrideBrowserslist，autoprefixer 新版本的写法有变
          })
        ],
      },
    },
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    compress: true,
    host: HOST || '0.0.0.0',
    port: PORT || '8080',
    open: false,
    openPage: 'login.html',
    index: 'login.html',
    overlay: { warnings: false, errors: true, },
    proxy: config.proxy(),
    quiet: true,
    watchOptions: {
      poll: false,
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', '404.html'), }
      ],
    },
  },
  // parralel: require('os').cpus().length > 1,
  // pwd: {},
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/common/less/index.less')
      ],
    },
  },
}

// 启动仪式
if (process.env.NODE_ENV !== 'production') {
  console.error([
    '888888  db          dP88   dPYb     dP88',
    '  88   dPYb        dP 88  dP   Yb  dP 88',
    '  88  dP__Yb      d888888 Yb   dP d888888',
    '  88 dP    Yb         88   YbodP      88'
  ].join('\n'))
  console.warn([
    '',
    '                   _ooOoo_',
    '                  o8888888o',
    '                  88" . "88',
    '                  (| -_- |)',
    '                  O\\  =  /O',
    '               ____/`---\'\\____',
    '             .\'  \\\\|     |//  `.',
    '            /  \\\\|||  :  |||//  \\',
    '           /  _||||| 卍 |||||-  \\',
    '           |   | \\\\\\  -  /// |   |',
    '           | \\_|  \'\'\\---/\'\'  |   |',
    '           \\  .-\\__  `-`  ___/-. /',
    '         ___`. .\'  /--.--\\  `. . __',
    '      ."" \'<  `.___\\_<|>_/___.\'  >\'"".',
    '     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |',
    '     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /',
    '======`-.____`-.___\\_____/___.-`____.-\'======',
    '                   `=---=\'',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '         佛祖保佑       永无BUG'
  ].join('\n'))
}
