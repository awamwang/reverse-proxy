var http = require('http')
var https = require('https')
var httpProxy = require('http-proxy')

var fs = require('fs')

function makeProxy (config) {
  var proxyOptions = config.proxyOptions || {}
  console.log(proxyOptions)
  var proxy = httpProxy.createProxyServer(proxyOptions)

  var httpOptions = config.httpOptions || {}
  console.log(httpOptions)

  var server
  if (config.ssl) {
    Object.assign(httpOptions, {
      key: fs.readFileSync(config.sslKey || './secure/server.key', 'utf8'),
      cert: fs.readFileSync(config.sslCert || './secure/server.crt', 'utf8')
    })

    server = https.createServer(httpOptions, function(req, res) {
      // console.log(req.headers)
      proxy.web(req, res, { target: config.target })
    })
  } else {
    server = http.createServer(httpOptions, function(req, res) {
      // console.log(req.headers)
      proxy.web(req, res, { target: config.target })
    })
  }

  var port = config.listenPort
  console.log("listening on port " + port)
  server.listen(port)
}

module.exports = function (configs) {
  for (var key in configs) {
    var config = configs[key]
    makeProxy(config)
  }
}