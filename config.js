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
        origin: /niwodai.wm.dev.echo58.com/,
        target: 'http://127.0.0.1:8082'
      },
      {
        origin: /yunweili.wm.dev.echo58.com/,
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