/* eslint-disable no-magic-numbers */
const CONF = require('config');

exports.config = {
  name: 'bar-web-acceptance-tests',
  // tests: './test/end-to-end/tests/*_test.js',
  tests: './test/end-to-end/tests/BARDeliveryManager_test.js',
  timeout: 180000,
  output: '../functional-output',
  fullPageScreenshots: true,
  helpers: {
    Puppeteer: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout: 60000,
      waitForAction: 200,
      getPageTimeout: 20000,
      waitForNavigation: 'networkidle0',
      // waitForNavigation: 'domcontentloaded',
      show: true,
      restart: true,
      keepCookies: false,
      keepBrowserState: true,
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
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
