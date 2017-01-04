module.exports = {
  1: {
    listen: 80,
    target: 'http://127.0.0.1:8083',
    ssl: false,
    httpOptions: {
    },
    proxyOptions: {
    },
    proxyTable: [
      {
        origin: /niwodai.wm.dev.echo58.com/,
        target: 'http://127.0.0.1:8082'
      },
      {
        origin: /yunweili.wm.dev.echo58.com/,
        target: 'http://127.0.0.1:8083'
      }
    ]
  },
  2: {
    listen: 443,
    target: 'http://127.0.0.1:8082',
    ssl: true,
    httpOptions: {
    },
    proxyOptions: {
    },
    proxyTable: [
      {
        origin: /niwodais.wm.dev.echo58.com/,
        target: 'http://127.0.0.1:8082'
      },
      {
        origin: /yunweilis.wm.dev.echo58.com/,
        target: 'http://127.0.0.1:8083'
      }
    ]
  }
}