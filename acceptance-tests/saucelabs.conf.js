/* eslint-disable */
const CONF = require('config');
const supportedBrowsers = require('./test/end-to-end/crossbrowser/supportedBrowsers.js');
const event = require('codeceptjs').event;
const container = require('codeceptjs').container;

const getBrowserConfig = browserGroup => {
  const browserConfig = [];

  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];

      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }

  return browserConfig;
};

const setupConfig = {
  name: 'cross-browser',
  tests: './test/end-to-end/tests/BARDeliveryManager_test.js',
  output: `${process.cwd()}/functional-output/cross-browser/reports`,
  helpers: {
    Playwright: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout: 60002,
      waitForAction: 800,
      timeout: 20004,
      waitForNavigation: 'domcontentloaded',
      ignoreHTTPSErrors: true,
      capabilities: {}
    },
    Helpers: { require: './helper/Helpers.js' },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
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
    }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js'
  },
  multiple: {
    webkit: {
      browsers: getBrowserConfig('webkit')
    },
    chromium: {
      browsers: getBrowserConfig('chromium')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    }
  }
};

event.dispatcher.on(event.test.before, function (test) {
  const {Playwright} = container.helpers();
  test.title = test.title + ' - ' + Playwright.options.capabilities['sauce:options'].name;
});

exports.config = setupConfig;
