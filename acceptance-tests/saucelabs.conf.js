const supportedBrowsers = require('acceptance-tests/test/end-to-end/crossbrowser/supportedBrowsers.js');

const testConfig = require('acceptance-tests/test/end-to-end/config/BARConfig');

const config = require('config');

/* eslint-disable no-magic-numbers */
const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.BROWSER_GROUP || 'chrome';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['bar-api']
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options']
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  tests: './test/end-to-end/tests/BARDeliveryManager_test.js',
  output: `${process.cwd()}/${testConfig.TestOutputDir}`,
  helpers: {
    WebDriver: {
      url: config.e2e.frontendUrl,
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
    },
    SauceLabsReportingHelper: { require: './helper/SauceLabsReportingHelper.js' },
    Mochawesome: { uniqueScreenshotNames: 'true' },
    Helpers: { require: './helper/Helpers.js' }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: testConfig.TestAutoDelayEnabled,
      delayAfter: 2000
    }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    Idam: './test/end-to-end/pages/idam_backdoor.js'
  },

  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: `${testConfig.TestOutputDir}/result.xml` }
      },
      mochawesome: {
        stdout: `${testConfig.TestOutputDir}/console.log`,
        options: {
          reportDir: testConfig.TestOutputDir,
          reportName: 'index',
          reportTitle: `Crossbrowser results for: ${browser.toUpperCase()}`,
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    microsoft: { browsers: getBrowserConfig('microsoft') },
    chrome: { browsers: getBrowserConfig('chrome') },
    firefox: { browsers: getBrowserConfig('firefox') },
    safari: { browsers: getBrowserConfig('safari') }
  },
  name: 'Bar-web Cross-Browser Tests'
};

exports.config = setupConfig;
