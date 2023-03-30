/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
const BARATConstants = require('./BARAcceptanceTestConstants');
const testConfig = require('../config/BARConfig');

let paymentReferenceSite1 = '';
let paymentReferenceSite2 = '';

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

async function getNumOfActions(order, that) {
  const num = await that.grabTextFrom(`//div/app-action-filter/div/ul/li[${order}]/a`).then(str => parseInt(str.match(/\((.+)\)/)[1]));
  return num;
}

async function collectActionNumbers(that) {
  that.clickCheckAndSubmit();
  const site = {};
  site.process = await getNumOfActions(1, that);
  site.return = await getNumOfActions(4, that);
  site.refund = await getNumOfActions(5, that);
  site.withdraw = await getNumOfActions(6, that);
  return site;
}

Feature('BAR multi site users tests');

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

Scenario('@functional Fee-clerk "check and submit" validate action counter', async({ I }) => {
  await I.login(testConfig.TestBarSwitchSiteUserName, testConfig.TestBarSwitchSitePassword);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  // Creating two payments on site1
  const payerNameSite1 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite1, '273', paymentReferenceSite1, I);
  I.click('Add another payment');
  createPayment(payerNameSite1, '273', paymentReferenceSite1, I);

  // Collect action info
  const site1Before = await collectActionNumbers(I);

  // Create two payments on site2
  await I.switchSite('MEDWAY COUNTY COURT');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite2, '273', paymentReferenceSite2, I);
  I.click('Add another payment');
  createPayment(payerNameSite2, '273', paymentReferenceSite2, I);

  // Collect action info
  const site2Before = await collectActionNumbers(I);

  // Site2 refund
  I.clickPaymentList();
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
  I.click('#Refund');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('Submit');

  I.processPayment();

  // Site1 return
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickPaymentList();
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
  I.waitForText('Return', BARATConstants.twoSecondWaitTime);
  I.click('#Return');
  I.waitForText('Reason for return', BARATConstants.twoSecondWaitTime);
  I.selectOption('Reason for return', '1');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('Submit');

  // Site1 withdraw
  I.clickPaymentList();
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
  I.waitForText('Withdraw', BARATConstants.twoSecondWaitTime);
  I.click('#Withdraw');
  I.waitForText('Reason for withdraw', BARATConstants.twoSecondWaitTime);
  I.selectOption('Reason for withdraw', '2');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('Submit');

  I.clickCheckAndSubmit();
  I.see(`Process(${site1Before.process})`);
  I.see(`Refund(${site1Before.refund})`);
  I.see(`Return(${site1Before.return + 1})`);
  I.see(`Withdraw(${site1Before.withdraw + 1})`);

  await I.switchSite('MEDWAY COUNTY COURT');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.clickCheckAndSubmit();
  I.see(`Process(${site2Before.process + 1})`);
  I.see(`Refund(${site2Before.refund + 1})`);
  I.see(`Return(${site2Before.return})`);
  I.see(`Withdraw(${site2Before.withdraw})`);

  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Fee-clerk Advance search for multi site -  All statuses', async({ I }) => {
  await I.login(testConfig.TestBarSwitchSiteUserName, testConfig.TestBarSwitchSitePassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite1, '273', paymentReferenceSite1, I);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.twoSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite1);
  I.seeElement('#status', 'option("Pending")');
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.see(payerNameSite1);
  await I.switchSite('MEDWAY COUNTY COURT');
  const payerNameSite2 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite2, '273', paymentReferenceSite2, I);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.twoSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite2);
  I.seeElement('#status', 'option("Pending")');
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Search results', BARATConstants.fiveSecondWaitTime);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
