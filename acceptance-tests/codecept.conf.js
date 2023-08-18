/* eslint-disable */
const CONF = require('config');

exports.config = {
  name: 'bar-web-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 180000,
  output: `${process.cwd()}/functional-output/functional/reports`,
  helpers: {
    Playwright: {
      url: CONF.e2e.frontendUrl,
      show: true,
      browser: 'chromium',
      waitForTimeout: 60001,
      waitForAction: 500,
      timeout: 20002,
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true,
      fullPageScreenshots: true,
      uniqueScreenshotNames: true,
      recordVideo: {
        dir: `${process.cwd()}/functional-output/functional/reports`,
        size : {
          width: 1024,
          height: 768
        }
      }
    },
    Helpers: { require: './helper/Helpers.js' }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    autoDelay: {
      enabled: true
    },
    retryTo: {
      enabled: true
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy'
    },
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js'
  },
  mocha: {}
};
