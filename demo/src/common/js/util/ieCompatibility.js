import 'core-js/stable'
import 'regenerator-runtime/runtime'

if (navigator.appName === 'Microsoft Internet Explorer' && navigator.appVersion.match(/9./i) === '9.') {
  // require('ie-placeholder')
}

// 兼容IE oninput事件
if (navigator.userAgent.indexOf('MSIE 9') > 0) {
  document.addEventListener('selectionchange', function () {
    const el = document.activeElement
    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT')) {
      const ev = document.createEvent('CustomEvent')
      ev.initCustomEvent('input', true, true, {})
      el.dispatchEvent(ev)
    }
  })
}
