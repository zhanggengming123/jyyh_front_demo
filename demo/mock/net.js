/*
version：0.0.1
全局参数说明：
req：36742 端口拿到的请求信息
res：36742 应该返回的请求信息


statereq : 发起获取接口状态的请求信息
stateres : 发起获取接口状态的请求信息

reqMock： 发起mock请求参数
resMock： 发起mock请求参数


reqReal: 向真实服务器发送请求
resReal: 向真实服务器的返回值
 */


// 引用别人的工具包
var http = require('http')
var https = require('https')
var url = require('url')
var pass = require('stream').PassThrough

// 通过req请求 ，继续拿到一个req请求。 该请求的接口方是API管理平台的MOCK服务端
var getHeader = function (req) {
  var ret = {}
  // 遍历 头信息，进行重新装填 ~~~~~~待删除：
  for (var i in req.headers) {
    if (!/^(host|connection|Access-|origin|referer|user-agent|X-Requested-With)/i.test(i)) {
      ret[i] = req.headers[i]
    }
  }
  ret['accept'] = '*/*'
  return ret
}



// 处理获取接口状态之后对于 最大的res的处理
var filterResHeader = function (headers, res) {
  var ret = {}
  res.setHeader('Cache-Control', 'no-cache,no-store')
  res.setHeader('Pragrma', 'no-cache')
  res.setHeader('Expires', 0)
  var resHeaders = res.getHeader('Access-Control-Expose-Headers') ? res.getHeader('Access-Control-Expose-Headers').toLowerCase() : ''
  for (var i in headers) {
    if (!/Access-/i.test(i)) {
      if (/set-cookie/i.test(i)) {
        for (let index = 0; index < headers[i].length; index++) {
          headers[i][index] = headers[i][index].split(' ')[0]
        }
        ret[i] = headers[i]
      } else {
        ret[i] = headers[i]
      }
    }
    if (!resHeaders) {
      res.setHeader('Access-Control-Expose-Headers', i)
    } else if (resHeaders.indexOf(i.toLowerCase() + ',') == -1 && resHeaders.indexOf(',' + i.toLowerCase()) == -1) {
      res.setHeader('Access-Control-Expose-Headers', res.getHeader('Access-Control-Expose-Headers') + ',' + i)
    }
  }
  return ret
}

// 主体代理服务 ，这里的res是是36742最后的res ，这里的req是36742 获取到的req
var onProxy = function (req, res) {
  handleHeader(req, res)
  if (req.method == 'OPTIONS') {
    return
  }
  // 发起是否能走mock请求
  mock(req, res)
}


// 发起mock请求的过程：
function mock(req, res) {
  //获取mock地址
  var obj = url.parse(mockUrl)
  //真实的后缀。端口后面的名字
  var path = req.headers.path || url.parse(req.url).path
  // 构建第一次获取接口状态的请求：
  var opt = {
    host: obj.hostname,
    path: '/api/service/queryStatus', // 获取接口状态的端口
    method: 'POST',
    headers: getHeader(req),
    port: obj.port ? obj.port : 80,
  }
  // 获取应用ID
  var  projectId = ""
  if (obj.pathname != '/') {
    var temp = obj.pathname.split("/")
    projectId = temp[temp.length - 1]
  } else {
    console.log("应用ID获取失败，请检查配置的MOCK路径。")
  }
  // 构建第一次获取接口状态的请求参数
  var data = {'projectId': projectId, 'method': req.method, 'path': path, "test": ""};
  console.log('发起获取当前接口状态请求：method:' + opt.method + ' host:' + opt.host + ' port:' + opt.port + ' path:' + opt.path)
  console.log('接口状态请求参数：' + JSON.stringify({'projectId': projectId, 'method': req.method, 'path': path}))

  //content-length的处理
  if (opt.headers['content-length']) {
    delete opt.headers['content-length']
  }



  // 发起获取状态请求
  var statereq = http.request(opt, function (stateres) {
    // 状态请求的response 处理
    stateres.setEncoding('utf-8');
    stateres.on('data', function (data) {
      var temp=JSON.parse(data)
      var  reCallData=temp.data   // 记录 获取状态的 返回值

      console.log('请求状态反参展示：'+JSON.stringify(reCallData))

      // 调用mock数据
      if (!realUrl || reCallData.isFinished == '0') {
        // 调用mock数据
        console.log('接口正在开发中，返回mock数据')
        // mock 请求参数
        var dataMock = {'serviceId': reCallData.serviceId, "test": ""};
        // mock请求参数配置
        var optMock = {
          host: obj.hostname,
          path: '/api/mock/' + projectId,
          method: 'POST',
          headers: getHeader(req),
          port: obj.port ? obj.port : 80
        }
        console.log('发起获取MOCK数据请求：method:' + optMock.method + ' host:' + optMock.host + ' port:' + optMock.port + ' path:' + optMock.path)
        console.log('MOCK数据请求参数：' + JSON.stringify({'serviceId': reCallData.serviceId}))
        // 发起获取参数的请求
        var reqMock = http.request(optMock, function (resMock) {
          var Result=""
          res.writeHead(resMock.statusCode, filterResHeader(resMock.headers, res))
          resMock.on('data', function (data) {
            // 获取到mock的值
            let temp =JSON.parse(data)
            Result=JSON.stringify(temp.data)
            console.log('MOCK接口调用完成。'+Result)
            console.log('------------------------------------------------------------------------------')

          })
          // 处理修改res的返回值


          // 不通过管道，最后直接赋值
          resMock.pipe(res)  // res=resMock
          resMock.on('end', function () {})
        })
        reqMock.write(require('querystring').stringify(dataMock));

        // 操作
        if (/POST|PUT/i.test(req.method)) {
          stream.pipe(reqMock) //reqMock=stream
        }else{
          reqMock.end()
        }
        // 模拟数据报错返回错误原因
        reqMock.on('error', function (err) {
          res.end(err.stack)
        })

      }


      // 调用真实数据
      else {
        if (reCallData.isFinished == '1') {
          console.log('接口已完成，调用真实接口')
        } else {
          console.log('该接口未在API管理平台上，转调真实接口')
        }

        // 开始发起真实数据的请求
        var headers = getHeader(req)
        var objUrl = url.parse(realUrl)
        var requestReal, optReal

        //根据不同情况初始化请求参数
        if (objUrl.protocol == 'http:') {
          optReal = {
            host: objUrl.hostname,
            path: (objUrl.pathname == '/' ? '' : objUrl.pathname) + path,
            method: req.method,
            port: objUrl.port ? objUrl.port : 80,
            headers: headers
          }
          requestReal = http.request
        } else {
          optReal = {
            host: objUrl.hostname,
            path: (objUrl.pathname == '/' ? '' : objUrl.pathname) + path,
            method: req.method,
            port: objUrl.port ? objUrl.port : 443,
            headers: headers,
            rejectUnauthorized: false,
            requestCert: true
          }
          requestReal = https.request
        }
        console.log('调用真实接口：method:' + optReal.method + ' host:' + optReal.host + ' port:' + optReal.port + ' path:' + optReal.path)

        //发起真实数据的请求
        var reqReal = requestReal(optReal, function (resReal) {
          console.log('真实接口调用完成。')
          console.log('------------------------------------------------------------------------------')
          // 头文件的写入
          res.writeHead(resReal.statusCode, filterResHeader(resReal.headers, res))
          resReal.pipe(res) // res=resReal
          resReal.on('end', function () {})
        })


        //操作
        if (/POST|PUT/i.test(req.method)) {
          stream.pipe(reqReal) //reqReal=stream
        }else{
          reqReal.end()
        }
        // 请求真实数据失败就返回错误信息
        reqReal.on('error', function (err) {
          res.end(err.stack)
        })
      }

    })
  })




  // 获取请求 的 请求参数装填 ：requestBody内容
  statereq.write(require('querystring').stringify(data));

  //谜之操作
  var stream
  if (/POST|PUT|PATCH/i.test(req.method)) {
    stream = new pass()
    req.pipe(stream) // stream = req
    req.pipe(statereq) // statereq=req
  }else{
    statereq.end()
  }// 获取接口状态的过程中出错了，res为获取接口状态的错误说明
  statereq.on('error', function (err) {
    res.end(err.stack)
  })




}

// 对于res的头信息初步处理
function handleHeader (req, res) {
  if (!req.headers.origin) {
    return
  }
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.headers['access-control-request-headers']) {
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
  }
  res.setHeader('Access-Control-Expose-Headers', 'connection,content-length,date,x-powered-by,content-encoding,server,etag,accept-ranges,allow,content-language,set-cookie')
  if (req.method == 'OPTIONS') {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end()
  }
}

var faceConfig = require('../faceConfig.js')  // 获取到配置信息
var args = [faceConfig.mockServer, faceConfig.devServer]
var mockUrl = args[0] // 模拟服务地址
var realUrl = args[1] // 真实地址
var port = 36742 // node服务端口
var server = http.createServer(onProxy)// 在36742 端口开启Node服务
server.listen(port) // 在36742 端口开启Node服务
console.log(args.length > 0 ? ('启动Node本地服务，Mock数据正监听端口：' + port) : '请用API管理平台进行测试！')
