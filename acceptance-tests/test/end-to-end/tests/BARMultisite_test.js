/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
const BARATConstants = require('./BARAcceptanceTestConstants');

let paymentReferenceSite1 = '';
let paymentReferenceSite2 = '';

const type = {
  id: '#payment_type_POSTAL_ORDER',
  reference: 'Postal order number'
};

/* const toCheckXPath = '//div/app-card[2]/div/div[1]/h1';
const submittedXPath = '//div/app-card[1]/div/div[1]/h1'; */

function createPayment(name, amount, ref, that) {
  that.waitForElement('#payment_type_POSTAL_ORDER', BARATConstants.fiveSecondWaitTime);
  that.click('#payment_type_POSTAL_ORDER');
  that.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
  that.fillField('Payer name', name);
  that.fillField('Amount', amount);
  that.fillField('Postal order number', ref);
  that.waitForElement('.button', BARATConstants.tenSecondWaitTime);
  that.click('#instruction-submit');
  that.wait(20);
  that.waitForText('Add another payment', BARATConstants.tenSecondWaitTime);
}

function createPaymentPostClerk(name, amount, ref, that) {
  that.createPayment(type, name, amount, ref, 'PostClerk');
  that.see(ref);
}

function createPaymentFeeClerk(name, amount, ref, that) {
  that.createPayment(type, name, amount, ref, 'FeeClerk');
  that.see(ref);
}

async function getCourtName(that) {
  let text = await that.grabHTMLFrom('//div/div/ul[2]/li[1]/a');
  text = Array.isArray(text) ? text[0] : text;
  return text.substring(0, text.indexOf('<')).trim();
}

async function generatePayerName(that) {
  const courtName = await getCourtName(that).then(name => name.split(' ')[0]);
  return `${courtName} PAYER`;
}

/* async function getNumOfActions(order, that) {
  const num = await that.grabTextFrom(`//div/app-action-filter/div/ul/li[${order}]/a`).then(str => parseInt(str.match(/\((.+)\)/)[1]));
  return num;
} */

/* async function collectActionNumbers(that) {
  that.clickCheckAndSubmit();
  const site = {};
  site.process = await getNumOfActions(1, that);
  site.return = await getNumOfActions(4, that);
  site.refund = await getNumOfActions(5, that);
  site.withdraw = await getNumOfActions(6, that);
  return site;
} */

Feature('BAR multi site users tests').retry(BARATConstants.testRetry);

Before(I => {
  const time = new Date().getTime();
  paymentReferenceSite1 = `${time}`.substr(7, 6);
  paymentReferenceSite2 = `${time + 1}`.substr(7, 6);
  I.clickCheckAndSubmit = () => {
    I.click('Check and submit');
    // sometimes it fails to click this
    I.wait(BARATConstants.tenSecondWaitTime);
    I.click('Check and submit');
    I.wait(BARATConstants.twoSecondWaitTime);
    I.waitForText('To check', BARATConstants.fiveSecondWaitTime);
  };
  I.clickPaymentList = () => {
    I.click('Payments list');
    I.wait(BARATConstants.tenSecondWaitTime);
    I.waitForText('Payment ID', BARATConstants.fiveSecondWaitTime);
  };
  I.clickAddPayment = () => {
    I.click('Add payment');
    I.wait(BARATConstants.tenSecondWaitTime);
  };
  I.processPayment = () => {
    I.click('Payments list');
    I.wait(BARATConstants.tenSecondWaitTime);
    I.waitForElement('#paymentInstruction0', BARATConstants.tenSecondWaitTime);
    I.navigateValidateScreenAndClickAddFeeDetails();
    I.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    I.doActionOnPaymentInstruction('Process');
    I.dontSee('Please allocate all amount before processing.');
  };
});

Scenario('Post-clerk switches sites and check payment visibility', async I => {
  I.login('SiteSwitchPost@mailnesia.com', 'LevelAt12');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  await I.switchSite('BROMLEY COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  createPaymentPostClerk(payerNameSite1, '550', paymentReferenceSite1, I);
  I.see(payerNameSite1);
  await I.switchSite('MEDWAY COUNTY COURT');
  const payerNameSite2 = await generatePayerName(I);
  createPaymentPostClerk(payerNameSite2, '550', paymentReferenceSite1, I);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  await I.switchSite('BROMLEY COUNTY COURT');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.say(`Looking for: ${payerNameSite1}`);
  I.waitForText(payerNameSite1, BARATConstants.tenSecondWaitTime);
  I.see(payerNameSite1);
  I.dontSee(payerNameSite2);
  I.Logout();
});

Scenario('Fee-clerk switches sites and check payment visibility', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  I.wait(BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite1, '550', paymentReferenceSite1, I);
  await I.switchSite('MEDWAY COUNTY COURT');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite2, '550', paymentReferenceSite2, I);
  I.clickPaymentList();
  I.dontSee(payerNameSite1);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.dontSee(payerNameSite2);
  I.Logout();
});

/* Scenario.skip('Fee-clerk "check and submit" page validate with multisite', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(10);
  I.wait(BARATConstants.twoSecondWaitTime);
  const payerNameSite1 = await generatePayerName(I);
  const toCheckSite1 = await I.grabTextFrom(toCheckXPath);
  const submittedSite1 = await I.grabTextFrom(submittedXPath);

  // Check on the other site
  I.switchSite('MEDWAY COUNTY COURT');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.wait(BARATConstants.twoSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  const toCheckSite2 = await I.grabTextFrom(toCheckXPath);
  I.say(`Found ${toCheckSite2} payments in XPath ${toCheckXPath}`);
  const submittedSite2 = await I.grabTextFrom(submittedXPath);

  // Process a payment instruction and send to "check and submit"
  I.processPayment();
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.say(`Expecting to see: ${parseInt(toCheckSite2) + 1} in ${toCheckXPath}`);
  I.retry(BARATConstants.retryCountForStep).see(parseInt(toCheckSite2) + 1, toCheckXPath);
  I.see(payerNameSite2);

  // We check that on the other site nothing has changed
  I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.say(`Expecting to see: ${toCheckSite1} in: ${toCheckXPath}`);
  I.see(toCheckSite1, toCheckXPath);
  I.wait(BARATConstants.twoSecondWaitTime);
  I.dontSee(payerNameSite2);
  I.wait(BARATConstants.twoSecondWaitTime);
  // Switch back site to submit payment
  I.switchSite('MEDWAY COUNTY COURT');
  I.wait(20);
  I.checkAndSubmit(payerNameSite2, 'Submit');
  I.wait(20);
  const numberToCheck = parseInt(submittedSite2) + 1;
  I.say(`Expecting to see: ${numberToCheck} in: ${submittedXPath}`);

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
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.say(`Expecting to see: ${toCheckSite1}`);
  I.waitForText(toCheckSite1, BARATConstants.tenSecondWaitTime);
  I.say(toCheckSite1);
  I.say(toCheckXPath);

  I.retry(BARATConstants.retryCountForStep).see(toCheckSite1, toCheckXPath);
  I.see(submittedSite1, submittedXPath);

  // process other sites payments
  I.processPayment();
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.see(parseInt(toCheckSite1) + 1, toCheckXPath);
  I.see(payerNameSite1);

  // Validate we don't see the payment on the other site (site 2)
  I.switchSite('MEDWAY COUNTY COURT');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.dontSee(payerNameSite1);
  // submit the newly processed payment on site1
  I.switchSite('MILTON KEYNES COUNTY COURT');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.checkAndSubmit(payerNameSite1, 'Submit');
  const expectedNumber = parseInt(submittedSite1) + 1;
  I.waitForText(expectedNumber, BARATConstants.tenSecondWaitTime);
  // even though it's found the text sometimes it hasn't fully loaded :(
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see(expectedNumber, submittedXPath);
  I.see(toCheckSite1, toCheckXPath);

  // and finally check again on the other site
  I.switchSite('MEDWAY COUNTY COURT');
  I.wait(20);
  I.clickCheckAndSubmit();
  I.wait(20);
  I.waitForText(toCheckSite2, BARATConstants.tenSecondWaitTime);
  // even though it's found the text sometimes it hasn't fully loaded :(
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see(numberToCheck, submittedXPath);
  I.see(toCheckSite2, toCheckXPath);

  // Logout
  I.Logout();
});

Scenario.skip('Fee-clerk "check and submit" validate action counter', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  // Creating two payments on site1
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite1 = await generatePayerName(I);
  I.clickAddPayment();
  I.wait(BARATConstants.twoSecondWaitTime);
  createPayment(payerNameSite1, '550', paymentReferenceSite1, I);
  I.click('Add another payment');
  createPayment(payerNameSite1, '550', paymentReferenceSite1, I);

  // Collect action info
  const site1Before = await collectActionNumbers(I);

  // Create two payments on site2
  I.switchSite('MEDWAY COUNTY COURT');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  I.clickAddPayment();
  createPayment(payerNameSite2, '550', paymentReferenceSite1, I);
  I.click('Add another payment');
  createPayment(payerNameSite2, '550', paymentReferenceSite1, I);

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
  I.switchSite('MILTON KEYNES COUNTY COURT');
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

  I.switchSite('MEDWAY COUNTY COURT');
  I.clickCheckAndSubmit();
  I.see(`Process(${site2Before.process + 1})`);
  I.see(`Refund(${site2Before.refund + 1})`);
  I.see(`Return(${site2Before.return})`);
  I.see(`Withdraw(${site2Before.withdraw})`);

  I.Logout();
}); */

Scenario('Fee-clerk Advance search for multi site -  All statuses', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  I.wait(BARATConstants.tenSecondWaitTime);
  await I.switchSite('MILTON KEYNES COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite1, '550', paymentReferenceSite1, I);
  I.see(payerNameSite1);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.twoSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite1);
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.see(payerNameSite1);
  await I.switchSite('MEDWAY COUNTY COURT');
  const payerNameSite2 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite2, '550', paymentReferenceSite1, I);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.twoSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite2);
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Search results', BARATConstants.fiveSecondWaitTime);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  I.Logout();
});

Scenario('Fee-clerk Advance search for multi site - Status pending', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  await I.switchSite('BROMLEY COUNTY COURT');
  const payerNameSite1 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite1, '550', paymentReferenceSite1, I);
  I.see(payerNameSite1);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.fiveSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite1);
  I.seeElement('#status', 'option("Pending")');
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText(payerNameSite1, BARATConstants.fiveSecondWaitTime);
  I.see(payerNameSite1);
  await I.switchSite('MEDWAY COUNTY COURT');
  const payerNameSite2 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite2, '550', paymentReferenceSite1, I);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  I.click('Advanced search');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Action', BARATConstants.fiveSecondWaitTime);
  I.fillField('input[name = "search"]', payerNameSite2);
  I.seeElement('#status', 'option("Pending")');
  I.click('Apply');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Search results', BARATConstants.fiveSecondWaitTime);
  I.see(payerNameSite2);
  I.see('Pay hub reference');
  I.Logout();
});
