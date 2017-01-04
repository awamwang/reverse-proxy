# reverse-proxy

## 继承特性

基于http-proxy https://www.npmjs.com/package/http-proxy
保留node http(s)和http-proxy的配置

## 新增特性

按请求headers中的host字段分发请求，起到反向代理作用
提供默认的字段全空的证书文件，用来快速的启动一个https的server（这个证书不会被浏览器信任，手动信任即可），同时覆盖了httpOptions中相关的key和cert两个字段

## 使用

## 匹配

使用正则表达式判断匹配
第一个匹配到的转发规则生效，后面规则将不被尝试

## 改进

添加Nginx相似的功能
使用agent

## 另外

性能不能和Nginx比拟，性能重要时，尝试Nginx配置js化——https://www.npmjs.com/package/nginx-conf