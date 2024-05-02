/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
const BARATConstants = require('./BARAcceptanceTestConstants');
const testConfig = require('../config/BARConfig');

let paymentReferenceSite1 = '';
let paymentReferenceSite2 = '';

const toCheckXPath = '//div/app-card[2]/div/div[1]/h1';
const submittedXPath = '//div/app-card[1]/div/div[1]/h1';

function createPayment(name, amount, ref, that) {
  that.waitForElement('#payment_type_POSTAL_ORDER', BARATConstants.fiveSecondWaitTime);
  that.click('#payment_type_POSTAL_ORDER');
  that.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
  that.fillField('Payer name', name);
  that.fillField('Amount', amount);
  that.fillField('Postal order number', ref);
  that.waitForElement('.button', BARATConstants.tenSecondWaitTime);
  that.click('#instruction-submit');
  that.wait(10);
  that.waitForText('Add another payment', BARATConstants.tenSecondWaitTime);
}

function randomString(length = 10) {
  return Math.random().toString(36).substr(2, length);
}

async function getCourtName(that) {
  let text = await that.grabHTMLFrom('//div/div/ul[2]/li[1]/a');
  text = Array.isArray(text) ? text[0] : text;
  return text.substring(0, text.indexOf('<')).trim();
}

async function generatePayerName(that) {
  const courtName = await getCourtName(that).then(name => name.split(' ')[0]);
  return `${courtName} PAYER ${randomString()}`;
}

Feature('Tests which are covered by diff scenarios, excluding these tests from build due to the time constraints');

Before(({ I }) => {
  const time = new Date().getTime();
  paymentReferenceSite1 = `${time}`.substr(7, 6);
  paymentReferenceSite2 = `${time + 1}`.substr(7, 6);
  I.clickCheckAndSubmit = () => {
    I.click('Check and submit');
    // sometimes it fails to click this
    I.wait(BARATConstants.twoSecondWaitTime);
    I.click('Check and submit');
    I.wait(BARATConstants.twoSecondWaitTime);
    I.waitForText('To check', BARATConstants.fiveSecondWaitTime);
  };
  I.clickPaymentList = () => {
    I.click('Payments list');
    I.wait(BARATConstants.fiveSecondWaitTime);
    I.waitForText('Payment ID', BARATConstants.fiveSecondWaitTime);
  };
  I.clickAddPayment = () => {
    I.click('Add payment');
    I.wait(BARATConstants.twoSecondWaitTime);
  };
  I.processPayment = () => {
    I.click('Payments list');
    I.wait(BARATConstants.fiveSecondWaitTime);
    I.waitForElement('#paymentInstruction0', BARATConstants.tenSecondWaitTime);
    I.navigateValidateScreenAndClickAddFeeDetails();
    I.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    I.doActionOnPaymentInstruction('Process');
    I.dontSee('Please allocate all amount before processing.');
  };
});

// Not needed to run in the pipeline as it's covered in the fee Clerk tests
Scenario('@functional Fee-clerk switches sites and check payment visibility', async({ I }) => {
  await I.login(testConfig.TestBarSwitchSiteUserName, testConfig.TestBarSwitchSitePassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite1, '300', paymentReferenceSite1, I);
  await I.switchSite('MEDWAY COUNTY COURT');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite2, '300', paymentReferenceSite2, I);
  I.clickPaymentList();
  I.dontSee(payerNameSite1);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.dontSee(payerNameSite2);
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

// Not needed to run in the pipeline as it's covered in the diff scenarios
Scenario('Fee-clerk "check and submit" page validate with multisite', async({ I }) => {
  await I.login(testConfig.TestBarSwitchSiteUserName, testConfig.TestBarSwitchSitePassword);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  I.clickCheckAndSubmit();
  I.wait(BARATConstants.twoSecondWaitTime);
  const payerNameSite1 = await generatePayerName(I);
  const toCheckSite1 = await I.grabTextFrom(toCheckXPath);
  const submittedSite1 = await I.grabTextFrom(submittedXPath);

  // Check on the other site
  I.switchSite('MEDWAY COUNTY COURT');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.wait(BARATConstants.twoSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  const toCheckSite2 = await I.grabTextFrom(toCheckXPath);
  I.say(`Found ${toCheckSite2} payments in XPath ${toCheckXPath}`);
  const submittedSite2 = await I.grabTextFrom(submittedXPath);

  // Process a payment instruction and send to "check and submit"
  I.processPayment();
  I.clickCheckAndSubmit();
  I.retry(BARATConstants.retryCountForStep).see(parseInt(toCheckSite2) + 1, toCheckXPath);
  I.see(payerNameSite2);

  // We check that on the other site nothing has changed
  I.switchSite('MILTON KEYNES COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.say(`Expecting to see: ${toCheckSite1} in: ${toCheckXPath}`);
  I.see(toCheckSite1, toCheckXPath);
  I.wait(BARATConstants.twoSecondWaitTime);
  I.dontSee(payerNameSite2);
  I.wait(BARATConstants.twoSecondWaitTime);
  // Switch back site to submit payment
  I.switchSite('MEDWAY COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.checkAndSubmit(payerNameSite2, 'Submit');
  const numberToCheck = parseInt(submittedSite2) + 1;

  I.waitForText(numberToCheck, BARATConstants.tenSecondWaitTime);
  // even though it's found the text sometimes it hasn't fully loaded :(
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see(numberToCheck, submittedXPath);
  I.say(`Expecting to see: ${toCheckSite2} in: ${toCheckXPath}`);
  I.waitForText(toCheckSite2, BARATConstants.tenSecondWaitTime);
  I.see(toCheckSite2, toCheckXPath);
  pause();
  // Switch back to validate that the numbers are correct on the other site
  I.switchSite('MILTON KEYNES COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.waitForText(toCheckSite1, BARATConstants.tenSecondWaitTime);
  I.say(toCheckSite1);
  I.say(toCheckXPath);

  I.retry(BARATConstants.retryCountForStep).see(toCheckSite1, toCheckXPath);
  I.see(submittedSite1, submittedXPath);

  // process other sites payments
  I.processPayment();
  I.clickCheckAndSubmit();
  I.see(parseInt(toCheckSite1) + 1, toCheckXPath);
  I.see(payerNameSite1);

  // Validate we don't see the payment on the other site (site 2)
  I.switchSite('MEDWAY COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.dontSee(payerNameSite1);
  // submit the newly processed payment on site1
  I.switchSite('MILTON KEYNES COUNTY COURT');
  I.clickCheckAndSubmit();
  I.checkAndSubmit(payerNameSite1, 'Submit');
  const expectedNumber = parseInt(submittedSite1) + 1;
  I.waitForText(expectedNumber, BARATConstants.tenSecondWaitTime);
  // even though it's found the text sometimes it hasn't fully loaded :(
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see(expectedNumber, submittedXPath);
  I.see(toCheckSite1, toCheckXPath);

  // and finally check again on the other site
  I.switchSite('MEDWAY COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.waitForText(toCheckSite2, BARATConstants.tenSecondWaitTime);
  // even though it's found the text sometimes it hasn't fully loaded :(
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see(numberToCheck, submittedXPath);
  I.see(toCheckSite2, toCheckXPath);

  // Logout
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
