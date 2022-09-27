'use strict';
/* eslint-disable */
const pa11y = require('pa11y');
const fs = require('fs');
const htmlReporter = require('pa11y-reporter-html');
const config = require('../acceptance-tests/test/end-to-end/config/BARConfig');
const outputFolder = 'functional-output';
const url = process.env.TEST_URL;

// Generates HTML reporter
const generateHTMLReport = html => new Promise((resolve, reject) => {
  fs.appendFile(`${outputFolder}/a11y.html`, html, err => {
    if (err) reject(new Error(err));
    resolve({ message: 'a11y report file updated.' });
  });
});

async function runTest() {

  try {

    // Pages running the tests
    console.log("payment-overview page");
    const pa11yResult1 = await pa11y(`${url}/payment-overview`, {

      actions: [
        `set field #username to ${config.TestBarDeliveryManagerUserName}`,
        `set field #password to ${config.TestBarDeliveryManagerPassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/payment-overview.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    console.log("reporting page");
    const pa11yResult2 = await pa11y(`${url}/reporting`, {

      actions: [
        `set field #username to ${config.TestBarDeliveryManagerUserName}`,
        `set field #password to ${config.TestBarDeliveryManagerPassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
        'click element #advanced-search-link'
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/reporting.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    console.log("user-admin page");
    const pa11yResult3 = await pa11y(`${url}/user-admin`, {

      actions: [
        `set field #username to ${config.TestBarDeliveryManagerUserName}`,
        `set field #password to ${config.TestBarDeliveryManagerPassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/user-admin.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    console.log("dashboard and add payment info page");
    const pa11yResult4 = await pa11y(`${url}/dashboard`, {

      actions: [
        `set field #username to ${config.TestBarFeeClerkUserName}`,
        `set field #password to ${config.TestBarFeeClerkPassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
        'wait for element #payment_type_CARD to be visible',
        'click element #payment_type_CARD',
        'wait for element #payer-name to be visible',
        'set field #payer-name to Test Payer',
        'set field #amount to 100',
        'wait for element #authorization-code to be visible',
        'set field #authorization-code to 123456',
        'click element .button',
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/dashboard-payment.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    console.log("paymentslog page");
    const pa11yResult5 = await pa11y(`${url}/paymentslog`, {

      actions: [
        `set field #username to ${config.TestBarFeeClerkUserName}`,
        `set field #password to ${config.TestBarFeeClerkPassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/paymentslog.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    console.log("feelog page");
    const pa11yResult6 = await pa11y(`${url}/feelog`, {

      actions: [
        `set field #username to ${config.TestBarSwitchSiteUserName}`,
        `set field #password to ${config.TestBarSwitchSitePassword}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
      ],
      wait: 1000,
      timeout: 70000,
      screenCapture: `${outputFolder}/feelog.png`,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    const pa11yResults = [pa11yResult1, pa11yResult2, pa11yResult3, pa11yResult4, pa11yResult5, pa11yResult6];

    for (let index = 0; index < pa11yResults.length; index++) {
      const pa11yResult = pa11yResults[index];

      htmlReporter.results(pa11yResult)
        .then(htmlResults =>
          generateHTMLReport(htmlResults)
            .then(response => {
              console.log(`Url: ${pa11yResult.pageUrl}`);
              console.log(`Number of issues: ${pa11yResult.issues.length}`);
              console.log(`File Status: ${response.message}`);
              console.log('--');
            })
            .catch(console.error));
    }
  } catch (error) {
    console.log(error);
  }
}


runTest();
