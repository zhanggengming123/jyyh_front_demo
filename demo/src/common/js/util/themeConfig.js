import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'

const themeConfig = require('../../../style/theme/index')
const faceConfig = require('../../../../faceConfig')
let lessLoaded = false

function changeTheme (newValue) {
  Modal.confirm({
    title: '确认刷新',
    content: '点击确认即刻刷新页面',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      location.reload()
    }
  })

  // if (!Base.testIE) {
  //   cssVars({
  //     onlyLegacy: true,
  //     watch: true,
  //     variables: {
  //       'primary-color': newValue
  //     }
  //   })
  // } else {
  //   cssVars({
  //     onlyLegacy: true,
  //     watch: true,
  //     variables: {
  //       'primary-color': newValue
  //     }
  //   })
  // }
}

Base.changeTheme = changeTheme

function themeChange (v) {
  let theme = v
  if (!theme) {
    theme = faceConfig.defaultTheme
  }
  // localStorage.theme = JSON.stringify(value)
  const changeColor = () => {
    window.less
      .modifyVars(
        themeConfig(theme)
      )
    cssVars({
      onlyLegacy: true,
      watch: true,
      variables: themeConfig(theme)
    })
  }

  if (lessLoaded) {
    changeColor()
  } else {
    window.less = {
      async: true,
      javascriptEnabled: true
    }
    loadLessAndScript().then(() => {
      lessLoaded = true
      changeColor()
    })
  }
}

function loadLessAndScript () {
  return new Promise((resolve, reject) => {
    const cssScript = document.createElement('script')
    cssScript.type = 'text/javascript'
    cssScript.src = 'static/_less/css-vars-ponyfill.min.js'
    document.head.appendChild(cssScript)

    const link = document.createElement('link')
    link.rel = 'stylesheet/less'
    link.type = 'text/css'
    link.href = 'static/_less/color.less'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'static/_less/less.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function changeThemeHandler () {
  if (!Base.testIE) {
    cssVars({
      onlyLegacy: true,
      watch: true
    })
    const themeStorage = Base.webStorage.init('index_theme', { isLocal: true })
    themeChange(themeStorage.get('index_theme'))
  } else {
    themeChange(localStorage.index_theme)
    // cssVars({
    //   onlyLegacy: true,
    //   watch: true,
    //   variables: {
    //     'primary-color': 'blue'
    //   }
    // })
  }
}

export { changeThemeHandler }
