/* eslint-disable */

const supportedBrowsers = require('acceptance-tests/test/end-to-end/crossbrowser/supportedBrowsers.js');
const testConfig = require('config');

const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['FeeAndPay']
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
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

testConfig.TestOutputDir = undefined;
const setupConfig = {
  tests: './test/end-to-end/tests/*_test.js',
  output: './output',
  helpers: {
    WebDriver: {
      url: testConfig.e2e.frontendUrl,
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
      },
    SauceLabsReportingHelper: { require: './test/end-to-end/helpers/SauceLabsReportingHelper.js' },
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
    config: 'config.js',
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
        options: { mochaFile: 'output/result.xml' }
      },
      mochawesome: {
        stdout: 'output/console.log',
        options: {
          reportDir: 'output',
          reportName: 'index',
          reportTitle: 'Crossbrowser results',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    chrome: { browsers: getBrowserConfig('chrome') },
    firefox: { browsers: getBrowserConfig('firefox') }
  },
  name: 'Fee and Pay BAR Cross-Browser Tests'
};

exports.config = setupConfig;
