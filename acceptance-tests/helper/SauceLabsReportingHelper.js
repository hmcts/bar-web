'use strict';

/* eslint-disable no-process-env, no-console, prefer-template */

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;

const sauceUsername = process.env.SAUCE_USERNAME;
const sauceKey = process.env.SAUCE_ACCESS_KEY;


function updateSauceLabsResult(hasTestPassed, sessionId, test, error) {
  console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=bar-web');
  const testResult = {
    name: test.title,
    passed: hasTestPassed,
    customData: {
      testName: test.title,
      testFile: test.file
    }
  };
  if (error) {
    testResult.customData.errorMessage = error;
  }
  const testResultJson = JSON.stringify(testResult).replace('customData', 'custom-data');
  return 'curl -X PUT -s -d \'' + testResultJson + '\' -u ' + sauceUsername + ':' + sauceKey + ' https://eu-central-1.saucelabs.com/rest/v1/' + sauceUsername + '/jobs/' + sessionId;
}

/* eslint-disable func-names */
/* eslint-disable padded-blocks */
module.exports = function() {
  // Setting test success on SauceLabs
  /* eslint-disable arrow-parens */
  event.dispatcher.on(event.test.passed, (test) => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult(true, sessionId, test, null));
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, (test, error) => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult(false, sessionId, test, error));
  });
};
