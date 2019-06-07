/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
const BARATConstants = require('./BARAcceptanceTestConstants');

let paymentReferenceSite1 = '';
let paymentReferenceSite2 = '';

const type = {
  id: '#payment_type_POSTAL_ORDER',
  reference: 'Postal order number'
};

const toCheckXPath = '//div/app-card[2]/div/div[1]/h1';
const submittedXPath = '//div/app-card[1]/div/div[1]/h1';

function createPaymentFeeClerk(name, amount, ref, that) {
  that.createPayment(type, name, amount, ref);
  that.click('Payments list');
  that.waitForText(name, BARATConstants.tenSecondWaitTime);
  that.see(ref);
}

function createPaymentPostClerk(name, amount, ref, that) {
  that.createPayment(type, name, amount, ref, 'PostClerk');
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

async function feeClerkCreatePayments(I) {
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  const payerNameSite1 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite1, '550', paymentReferenceSite1, I);
  I.switchSite();
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  const payerNameSite2 = await generatePayerName(I);
  createPaymentFeeClerk(payerNameSite2, '550', paymentReferenceSite2, I);
  I.dontSee(payerNameSite1);
  I.switchSite();
  I.dontSee(payerNameSite2);
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

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  const time = new Date().getTime();
  paymentReferenceSite1 = `${time}`.substr(7, 6);
  paymentReferenceSite2 = `${time + 1}`.substr(7, 6);
  I.clickCheckAndSubmit = () => {
    I.click('Check and submit');
  };
  I.clickPaymentList = () => {
    I.click('Payments list');
  };
  I.processPayment = () => {
    I.click('Payments list');
    I.waitForElement('#paymentInstruction0', BARATConstants.tenSecondWaitTime);
    I.navigateValidateScreenAndClickAddFeeDetails();
    I.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    I.doActionOnPaymentInstruction('Process');
  };
});

Scenario('Post-clerk switches sites and check payment visibility', async I => {
  I.login('SiteSwitchPost@mailnesia.com', 'LevelAt12');
  I.waitForText('Add Payment', BARATConstants.tenSecondWaitTime);
  const payerNameSite1 = await generatePayerName(I);
  createPaymentPostClerk(payerNameSite1, '550', paymentReferenceSite1, I);
  I.see(payerNameSite1);
  I.switchSite();
  const payerNameSite2 = await generatePayerName(I);
  createPaymentPostClerk(payerNameSite2, '550', paymentReferenceSite1, I);
  I.see(payerNameSite2);
  I.dontSee(payerNameSite1);
  I.switchSite();
  I.click('Check and submit');
  I.see(payerNameSite1);
  I.dontSee(payerNameSite2);
  I.Logout();
});

Scenario('Fee-clerk switches sites and check payment visibility', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  await feeClerkCreatePayments(I);
  I.Logout();
});

Scenario('Fee-clerk "check and submit" page validate with multisite', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  await feeClerkCreatePayments(I);
  I.clickCheckAndSubmit();
  const payerNameSite1 = await generatePayerName(I);
  const toCheckSite1 = await I.grabTextFrom(toCheckXPath);
  const submittedSite1 = await I.grabTextFrom(submittedXPath);

  // Check on the other site
  I.switchSite();
  I.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  const payerNameSite2 = await generatePayerName(I);
  const toCheckSite2 = await I.grabTextFrom(toCheckXPath);
  const submittedSite2 = await I.grabTextFrom(submittedXPath);

  // Process a payment instruction and send to "check and submit"
  I.processPayment();
  I.click('Check and submit');
  I.see(parseInt(toCheckSite2) + 1, toCheckXPath);
  I.see(payerNameSite2);

  // We check that on the other site nothing has changed
  I.switchSite();
  I.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  I.see(toCheckSite1, toCheckXPath);
  I.dontSee(payerNameSite2);

  // Switch back site to submit payment
  I.switchSite();
  I.checkAndSubmit(payerNameSite2, 'Submit');
  I.see(parseInt(submittedSite2) + 1, submittedXPath);
  I.see(toCheckSite2, toCheckXPath);

  // Switch back to validate that the numbers are correct on the other site
  I.switchSite();
  I.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  I.see(toCheckSite1, toCheckXPath);
  I.see(submittedSite1, submittedXPath);

  // process other sites payments
  I.processPayment();
  I.click('Check and submit');
  I.see(parseInt(toCheckSite1) + 1, toCheckXPath);
  I.see(payerNameSite1);

  // Validate we don't see the payment on the other site (site 2)
  I.switchSite();
  I.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  I.dontSee(payerNameSite1);

  // submit the newly processed payment on site1
  I.switchSite();
  I.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
  I.click('Check and submit');
  I.checkAndSubmit(payerNameSite1, 'Submit');
  I.see(parseInt(submittedSite1) + 1, submittedXPath);
  I.see(toCheckSite1, toCheckXPath);

  // and finally check again on the other site
  I.switchSite();
  I.click('Check and submit');
  I.see(parseInt(submittedSite2) + 1, submittedXPath);
  I.see(toCheckSite2, toCheckXPath);

  // Logout
  I.Logout();
});

Scenario('Fee-clerk "check and submit" validate action counter', async I => {
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  await feeClerkCreatePayments(I);
  await feeClerkCreatePayments(I);
  const site1Before = await collectActionNumbers(I);

  I.switchSite();
  const site2Before = await collectActionNumbers(I);

  // Site2 refund
  I.clickPaymentList();
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
  I.click('#Refund');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('Submit');

  I.processPayment();

  // Site1 return
  I.switchSite();
  I.clickPaymentList();
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
  I.click('#Return');
  I.waitForText('Reason for return', BARATConstants.twoSecondWaitTime);
  I.selectOption('Reason for return', '1');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click('Submit');

  // Site1 withdraw
  I.clickPaymentList();
  I.click('#paymentInstruction0');
  I.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
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

  I.switchSite();
  I.clickCheckAndSubmit();
  I.see(`Process(${site2Before.process + 1})`);
  I.see(`Refund(${site2Before.refund + 1})`);
  I.see(`Return(${site2Before.return})`);
  I.see(`Withdraw(${site2Before.withdraw})`);

  I.Logout();
});
