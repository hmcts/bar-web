/* eslint-disable no-magic-numbers, object-curly-newline */
const CONF = require('config');

exports.config = {
  name: 'bar-web-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 180000,
  output: `${process.cwd()}/functional-output`,
  helpers: {
    Puppeteer: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout: 60000,
      waitForAction: 300,
      getPageTimeout: 20000,
      waitForNavigation: 'networkidle0',
      // waitForNavigation: 'domcontentloaded',
      show: false,
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
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 1
    },
    autoDelay: {
      enabled: true
    }
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: './functional-output/console.log',
        options: {
          mochaFile: './functional-output/result.xml',
          attachments: true
        }
      },
      mochawesome: {
        stdout: './functional-output/console.log',
        options: {
          reportDir: './functional-output',
          reportFilename: 'bar-web-e2e-result',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    parallel: {
      chunks: 4,
      browsers: ['chrome']
    }
  }
};
