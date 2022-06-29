const supportedBrowsers = require('acceptance-tests/test/end-to-end/crossbrowser/supportedBrowsers.js');

const config = require('config');

/* eslint-disable no-magic-numbers */
const waitForTimeout = 60000;
const smartWait = 5000;

const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  tags: ['bar-web'],
  extendedDebugging: true,
  capturePerformance: true
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

const getBrowserConfig = browserGroup => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(defaultSauceOptions, candidateCapabilities['sauce:options']);
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      /* eslint-disable no-console */
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
};

const setupConfig = {
  tests: './test/end-to-end/tests/BARDeliveryManager_test.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    WebDriver: {
      url: config.e2e.frontendUrl,
      browser: 'chrome',
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}

    },
    SauceLabsReportingHelper: { require: './helper/SauceLabsReportingHelper.js' },
    Helpers: { require: './helper/Helpers.js' },
    Mochawesome: { uniqueScreenshotNames: 'true' }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true,
      delayAfter: 2000
    }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    Idam: './test/end-to-end/pages/idam_backdoor.js'
  },
  /* eslint-disable object-curly-newline */
  /* eslint-disable quote-props*/
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: './functional-output/bar-web-mocha-stdout.log',
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './build/test-results/codeceptjs/bar-web-result.xml'
        }
      },
      'mochawesome': {
        stdout: './functional-output/bar-web-mochawesome-stdout.log',
        options: {
          reportDir: 'functional-output',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    microsoft: { browsers: getBrowserConfig('microsoft') },
    chrome: { browsers: getBrowserConfig('chrome') },
    firefox: { browsers: getBrowserConfig('firefox') }
  },
  name: 'Bar-web Cross-Browser Tests'
};

exports.config = setupConfig;
