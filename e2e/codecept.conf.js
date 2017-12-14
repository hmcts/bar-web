const ProxySettings = require('./proxy-settings');
const config = require('config');

const { timeout, webdriverio } = config;
const { host, port, browser, url, waitForTimeout } = webdriverio;

module.exports = {
  config: {
    tests: './paths/**.js',
    timeout,
    output: './output',
    name: 'bar-web-e2e-tests',
    helpers: {
      WebDriverIO: {
        host,
        port,
        browser,
        waitForTimeout,
        url,
        desiredCapabilities: { proxy: new ProxySettings() }
      }
    },
    include: { I: './pages/steps_file.js' },
    bootstrap: false,
    mocha: {}
  }
};
