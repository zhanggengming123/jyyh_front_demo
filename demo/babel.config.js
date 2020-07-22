module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltins: 'entry'
    }]
  ],
  plugins: [
    ['import', { libraryName: '@yh/ta404-ui', libraryDirectory: 'es', style: true }] // `style: true` 会加载 less 文件
  ]
}
