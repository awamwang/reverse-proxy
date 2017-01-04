var http = require('http')
var https = require('https')
var httpProxy = require('http-proxy')

var fs = require('fs')
var path = require('path')

var DEFAULT_PROXY_OPTIONS = {}
var DEFAULT_HTTP_OPTIONS = {}

function configServerProxy (req, res, proxy, config) {
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
  if (!matched && config.defaultTarget) {
    proxy.web(req, res, {target: config.defaultTarget})
  }
}

function handleProxy (proxy, proxyHandler) {
  proxy.on('error', function (err, req, res) {
    console.log(req.headers.host + 'err')
    res.end('Something went wrong. And we are reporting a custom error message.');
  })

  proxyHandler && proxyHandler(proxy)
}

function createServer (ssl, httpOptions, requestListener) {
  if (ssl) {
    return https.createServer(httpOptions, requestListener)
  } else {
    return http.createServer(requestListener)
  }
}

function startServer (name, config, messageHandler) {
  var server = createServer(config.ssl, config.httpOptions, messageHandler)
  var ports = config.listen

  ports = Object.prototype.toString.call(ports) === '[object Array]' ?
    ports :
    [ports]

  ports.map(function (port) {
    console.log('Server ' + name + ` Listening at http${config.ssl ? 's' : ''}://localhost:` + port + '\n')
    server.listen(port)
  })
}

function startProxyServer (name, config) {
  var proxyOptions = config.proxyOptions || DEFAULT_PROXY_OPTIONS
  var proxy = httpProxy.createProxyServer(proxyOptions)

  config.httpOptions = config.httpOptions || DEFAULT_HTTP_OPTIONS
  if (config.ssl) {
    Object.assign(config.httpOptions, {
      key: fs.readFileSync(config.sslKey || path.join(__dirname, '../secure/server.key'), 'utf8'),
      cert: fs.readFileSync(config.sslCert || path.join(__dirname, '../secure/server.crt'), 'utf8')
    })
  }

  handleProxy(proxy)

  startServer(name, config, function (req, res) {
    config.messageHandler && config.messageHandler(req, res)
    configServerProxy(req, res, proxy, config)
  })
}

module.exports = function start (configs) {
  for (var name in configs) {
    startProxyServer(name, configs[name])
  }
}