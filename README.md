# reverse-proxy

> 开发用的node.js反向代理reverse-proxy工具

## 概述

主要作用是在node环境下完成http请求的代理，更多考虑的是反向代理，正向代理http-proxy本身就可以比较轻松的配置。
这样实现了js对反向代理的直接控制，方便开发过程（没有验证过性能和可靠性，不能使用到生产中）。

## 继承特性

+ 基于http-proxy https://www.npmjs.com/package/http-proxy
+ 保留node http(s)和http-proxy的可配置项

## 新增特性

+ 按请求headers中的host字段分发请求，起到反向代理作用
+ 提供默认的字段全空的证书文件，用来快速的启动一个https的server（这个证书不会被浏览器信任，手动信任即可），证书配置设置的是httpOptions中key和cert两个字段配置， https://nodejs.org/dist/latest-v6.x/docs/api/https.html#https_https_createserver_options_requestlistener

## 使用

### 模块形式

模块引入时的配置文件，直接使用js代码

```
module.exports = {
  'http': {
    listen: 80,
    defaultTarget: 'http://127.0.0.1:8083',
    ssl: false,
    httpOptions: {
    },
    proxyOptions: {
    },
    messageHandler: function () {},
    proxyHandler: function () {},
    proxyTable: [
      {
        origin: /example.http.com/,
        target: 'http://127.0.0.1:8082'
      },
      {
        origin: /example.http.com/,
        target: 'http://127.0.0.1:8083'
      }
    ]
  },
  'https': {
    listen: 443,
    defaultTarget: 'http://127.0.0.1:8082',
    ssl: true,
    httpOptions: {
    },
    proxyOptions: {
    },
    messageHandler: function () {},
    proxyHandler: function () {},
    proxyTable: [
      {
        origin: /example1.https.com/,
        target: 'http://127.0.0.1:8082'
      },
      {
        origin: /example2.https.com/,
        target: 'http://127.0.0.1:8083'
      }
    ]
  }
}
```

主文件
```
var proxy = require('../src')
var configs = require('../config')

proxy(configs)
```

### 命令行

命令行的执行命令为 rps （reverse proxy server）

rps start // 按照配置命令启动服务器（目前只有这一个命令）

命令行config文件，使用config-master解析配置文件，名称为‘.reverse-proxy.json’

```
{
  "http": {
    "listen": 80,
    "defaultTarget": "http://127.0.0.1:8083",
    "ssl": false,
    "httpOptions": {
    },
    "proxyOptions": {
    },
    "proxyTable": [
      {
        "origin": "example1.com",
        "target": "http://127.0.0.1:8082"
      },
      {
        "origin": "example2.com",
        "target": "http://127.0.0.1:8083"
      }
    ]
  },
  "https": {
    "listen": 443,
    "defaultTarget": "http://127.0.0.1:8082",
    "ssl": true,
    "httpOptions": {
    },
    "proxyOptions": {
    },
    "proxyTable": [
      {
        "origin": "example1.com",
        "target": "http://127.0.0.1:8082"
      },
      {
        "origin": "example2.com",
        "target": "http://127.0.0.1:8083"
      }
    ]
  }
}
```

## 匹配

+ 使用正则表达式判断匹配
  proxyTable中的origin设置匹配域名，使用正则表达式（或将要转换成正则表达式的字符串）
+ 第一个匹配到的转发规则生效，后面规则将不被尝试

## 改进

+ 使用agent，提升性能
+ 添加Nginx相似的功能

## 另外

性能不能和Nginx、Apache比拟，性能重要时，可以尝试Nginx配置js化——https://www.npmjs.com/package/nginx-conf