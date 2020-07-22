/**
 * @author aolei 滑动验证码js 2017年9月29日11:18:12
 * modify by xp
 */
// 页面加载完成之后绑定拖动事件
import jQuery from 'jquery'

(function ($) {
  $.extend(true, window, {
    SlideCheckCode: slideCheckCode
  })
  function slideCheckCode (id, options) {
    var $p = $('#' + id)
    var mouseDragStartX = 0// 每次记录事件的开始X坐标轴 单位px
    var mouseDragEndX = 0// 每次记录事件的结束X坐标轴 单位px
    var isDown = false// 记录当前拖动是否已经完成
    var isCheck = false// 记录校验标志
    var isRefresh = true, isClickRefresh = false// 刷新标志isRefresh 控制是否重新计算图片的可拖拽范围（需保证前后台配置图片宽度一致）;isClickRefresh 处理特殊情况，见代码
    var mouseDragNum = 0// 记录总共移动的距离 单位px
    var mouseDragNumImg = 0
    var dragStartDate
    var dragEndDate
    var maxDragSize = 0// 记录dragBar可拖动的最大距离
    var winMaxDragSize = 0// 记录图片可拖动的范围，实际可拖动的最大距离还要减去拖动图片自身的宽度

    function init () {
      var timer
      $('.dragBar', $p).mouseenter(function () {
        if (timer) clearTimeout(timer)
        $('.codeDrag-win-div', $p).fadeIn(500)
      }).mousedown(function (e) {
        mouseDragStartX = e.pageX
        isDown = true
        dragStartDate = new Date().getTime()
        $('.dragBar-base-bg>span', $p).hide()
      })

      $('.codeDragBar-drag-div', $p).mouseenter(function () {
        if (timer) clearTimeout(timer)
      }).mouseleave(function () {
        if (isClickRefresh) return// 处理 多次点击刷新按钮时，意外触发该事件的情况 xp
        if (timer) clearTimeout(timer)
        if (!isDown && !isCheck) {
          timer = setTimeout(function () {
            $('.codeDrag-win-div', $p).fadeOut(500)
          }, 300)
        }
      })

      $(document).mousemove(function (e) {
        if (isDown) {
          $('.codeDragBar-drag-div', $p).addClass('dragBar-moving')
          calculationMaxSize()
          mouseDragEndX = e.pageX

          var dragX = mouseDragEndX - mouseDragStartX
          // 拖动范围控制
          if (dragX < 0) dragX = 0
          if (dragX > maxDragSize) dragX = maxDragSize
          mouseDragNum = dragX// 记录实际偏移量
          dargMove(mouseDragNum)
        }
      }).mouseup(function (e) {
        if (isDown) {
          isDown = false
          isCheck = true
          dragEndDate = new Date().getTime()
          Base.submit(null, { url: 'SlideVerifyServlet',
            data: {
              slidetime: dragEndDate - dragStartDate,
              slidewith: mouseDragNumImg
            } }, {
            successCallback: (data) => {
              var result = data.data.result

              // 鼠标移开，看当前移动的位置是否为后台传过来的位置
              if (result) { // success
                $('.codeDragBar-drag-div', $p).addClass('dragBar-check-success')
                // 登录
                if (typeof options.successCallBack == 'function') {
                  options.successCallBack()
                }
              } else {
                // failuer
                $('.codeDragBar-drag-div', $p).addClass('dragBar-check-fail')
              }
              setTimeout(function () {
                resetCodeDarg()
              }, 1000)
            }
          })
        }
      })
      // 刷新验证码
      $('.codeDrag-code-refresh', $p).click(function () {
        isClickRefresh = true
        refreshCode()
        setTimeout(function () {
          isClickRefresh = false
        }, 0)
      })

      // 页面加载完成之后请求验证码
      refreshSlideCheckCode()
    }

    function refreshCode () {
      isRefresh = true
      refreshSlideCheckCode()
    }

    function calculationMaxSize () {
      if (maxDragSize <= 0) maxDragSize = $('.codeDragBar-drag-div', $p).width() - $('.dragBar', $p).outerWidth()
      if (winMaxDragSize <= 0 || isRefresh == true) {
        isRefresh = false
        winMaxDragSize = $('.codeDrag-win-div-body', $p).width() - parseInt($('.codeDrag-darg-img', $p).css('left')) - $('.codeDrag-darg-img', $p).outerWidth()
      }
    }

    // 拖动
    function dargMove (dargSize) {
      var ratio = dargSize / maxDragSize// 计算偏移比例
      mouseDragNumImg = parseInt(winMaxDragSize * ratio)// 计算图片偏移量
      // 箭头块位置移动
      $('.dragBar', $p).css({ left: dargSize })
      // 拖动背景色
      $('.dragBar-inDrag-bg', $p).css({ width: dargSize })
      // 按比例移动拖动图片
      var slideImgLeft = parseInt($('.codeDrag-darg-img', $p).css('left'))
      $('.codeDrag-darg-img', $p).css({ left: mouseDragNumImg })
    }

    // 组件重置
    function resetCodeDarg () {
      isCheck = false
      // 清除校验结果样式
      $('.codeDragBar-drag-div', $p).removeClass('dragBar-moving')
      $('.codeDragBar-drag-div', $p).removeClass('dragBar-check-success').removeClass('dragBar-check-fail')
      // 还原状态
      mouseDragStartX = mouseDragEndX = mouseDragNum = 0
      dargMove(mouseDragNum)
      $('.dragBar-base-bg>span', $p).show()
      // 刷新图片
      $('.codeDrag-win-div', $p).fadeOut(500)
      setTimeout(function () {
        refreshCode()
      }, 500)
    }

    // 获取验证码
    function refreshSlideCheckCode () {
      Base.submit(null, { url: 'SlideParamImgServlet' }, {
        successCallback: (data) => {
          // 背景图获取
          $('.codeDrag-code-img', $p).attr('src', faceConfig.basePath + '/SlideBackGroundImgServlet?ticket=' + data.data.ticket)
          // 拖动图获取
          $('.codeDrag-darg-img', $p).attr('src', faceConfig.basePath + '/SlideDragImgServlet?ticket=' + data.data.ticket)
        }
      })
    }
    /**
         *拖动完成，鼠标移开，后台验证验证码是否正确
         * @param slidetime 滑动时间 单位毫秒
         * @param slidewidth 滑动距离(宽度 单位px)
         */
    function verifyCheckCode (slidetime, slidewidth) {
      var verifyResult = false
      Base.submit(null, { url: 'SlideVerifyServlet',
        data: {
          slidetime: slidetime,
          slidewith: slidewidth
        } }, {
        successCallback: (data) => {
          verifyResult = data.data.result
        }
      })
      return verifyResult
    }

    init()

    return {
      refreshSlideCheckCode: refreshSlideCheckCode
    }
  }
})(jQuery)
