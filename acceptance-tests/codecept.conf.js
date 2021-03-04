/* eslint-disable no-magic-numbers */
const CONF = require('config');

// const waitForTimeout = parseInt(CONF.e2e.waitForTimeoutValue);
// const waitForAction = parseInt(CONF.e2e.waitForActionValue);

exports.config = {
  name: 'bar-web-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 10000,
  output: '../functional-output',
  helpers: {
    Puppeteer: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout: 2000,
      waitForAction: 200,
      waitForNavigation: 'networkidle0',
      // waitForNavigation: 'domcontentloaded',
      show: false,
      restart: true,
      keepCookies: false,
      keepBrowserState: true,
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
      timeout: 300000,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          // '--proxy-server=proxyout.reform.hmcts.net:8080',
          // '--proxy-bypass-list=*beta*LB.reform.hmcts.net',
          '--start-maximized'
        ],
        defaultViewport: {
          width: 1600,
          height: 1200
        }
      }
    },
    Mochawesome: { uniqueScreenshotNames: 'true' },
    Helpers: { require: './helper/Helpers.js' }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    Idam: './test/end-to-end/pages/idam_backdoor.js'
  },
  mocha: {
    reporterOptions: {
      mochaFile: 'functional-output/result.xml',
      reportDir: 'functional-output',
      takePassedScreenshot: false,
      clearOldScreenshots: true,
      shortScrFileNames: false
    }
  },
  bootstrap: false
};
