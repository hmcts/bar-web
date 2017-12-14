const ProxySettings = require('./proxy-settings');

const timeout = process.env.E2E_TIMEOUT || 10000;
const waitForTimeout = process.env.E2E_WAITFOR_TIMEOUT || 15000;

const config = {
  name: 'bar-web-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout,
  output: './output',
  helpers: {
    WebDriverIO: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || '4444',
      browser: process.env.BROWSER || 'chrome',
      url: process.env.URL || 'https://localhost:3415',
      waitForTimeout,
      desiredCapabilities: {
        proxy: new ProxySettings()
      }
    }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    Idam: './test/end-to-end/pages/idam_backdoor.js'
  },
  bootstrap: false,
  mocha: {}
};

module.exports = { config };
