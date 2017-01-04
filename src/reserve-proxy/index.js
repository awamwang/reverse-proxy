var http = require('http')
var https = require('https')
var httpProxy = require('http-proxy')

var fs = require('fs')
var path = require('path')

function setProxy (req, res, proxy, config) {
  var matched = false
  var domain = req.headers.host

  for (var i = 0, len = config.proxyTable.length; i < len; i++) {
    var item = config.proxyTable[i]

    if (item.origin.test(domain)) {
      proxy.web(req, res, {target: item.target})
      matched = true
      break
    }
  }
  if (!matched) {
    proxy.web(req, res, {target: config.target})
  }
}

function startProxyServer (config, name) {
  var proxyOptions = config.proxyOptions || {}
  var proxy = httpProxy.createProxyServer(proxyOptions)

  var httpOptions = config.httpOptions || {}

  var server
  var ports = Object.prototype.toString.call(config.listen) === '[object Array]' ?
    config.listen : [config.listen]

  if (config.ssl) {
    Object.assign(httpOptions, {
      key: fs.readFileSync(config.sslKey || path.join(__dirname, '../secure/server.key'), 'utf8'),
      cert: fs.readFileSync(config.sslCert || path.join(__dirname, '../secure/server.crt'), 'utf8')
    })

    server = https.createServer(httpOptions, function (req, res) {
      setProxy(req, res, proxy, config)
    })

    ports.map(function (port) {
      console.log('Server ' + name + ' Listening at https://localhost:' + port + '\n')
      server.listen(port)
    })
  } else {
    server = http.createServer(function (req, res) {
      setProxy(req, res, proxy, config)
    })

    ports.map(function (port) {
      console.log('Server ' + name + ' Listening at http://localhost:' + port + '\n')
      server.listen(port)
    })
  }
}

module.exports = function start (configs) {
  for (var key in configs) {
    var config = configs[key]
    startProxyServer(config, key)
  }
}