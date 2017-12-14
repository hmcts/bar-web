const url = require('url');

module.exports = class ProxySettings {
  constructor() {
    if (process.env.HTTP_PROXY) {
      this.httpProxy = url.parse(process.env.HTTP_PROXY).host;
    }
    if (process.env.HTTPS_PROXY) {
      this.sslProxy = url.parse(process.env.HTTPS_PROXY).host;
    }
    if (process.env.NO_PROXY) {
      this.noProxy = process.env.NO_PROXY;
    }

    if (this.httpProxy || this.sslProxy || this.noProxy) {
      this.proxyType = 'manual';
    } else {
      this.proxyType = 'direct';
    }
  }
};
