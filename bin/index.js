#!/usr/bin/env node --harmony
var proxy = require('../src/index')

var fs = require('fs')
var loadConfig = require('config-master')
var program = require('commander')
var co = require('co')
var prompt = require('co-prompt')

var ansi = require('ansi-escape-sequences')
var arrayify = require('array-back')
var chalk = require('chalk')

var stored = loadConfig('reverse-proxy')

program
.arguments('<operation>')
.option('-c, --config <config>', 'The config file')
.option('-s, --server <server>', 'The server config')
// .option('-p, --password <password>', 'The user\'s password')
.action(function(operation) {
  switch (operation) {
    case 'start':
      start()
      break
    default:
      start()
  }
})
.parse(process.argv)

function start () {
  co(function *() {
    // var username = yield prompt('username: ')
    // var password = yield prompt.password('password: ')
    var options = mergeOptions(program.server || {})

    try {
      proxy(options.server)
    } catch (e) {
      stop(e, 1)
    }
  })
}

function stop (msgs, exitCode) {
  arrayify(msgs).forEach(msg => console.error(ansi.format(msg)))
  process.exitCode = exitCode
}

function mergeOptions (commandLineOptions) {
  let options = {}

  const builtIn = {
    // port: 8000,
    // directory: process.cwd(),
    // forbid: [],
    // rewrite: []
  }

  options.server = Object.assign(builtIn, stored, commandLineOptions.server)
  return options
}