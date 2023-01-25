const BARATConstants = require('./BARAcceptanceTestConstants');
const testConfig = require('../config/BARConfig');

const paymentReferenceSite1 = '454545';
const paymentReferenceSite2 = '232323';
const {
  addAndRemoveFeeToPaymentInstruction,
  createCashPaymentInstruction
} = require('../pages/steps');
const faker = require('faker');

Feature('BAR Fee Clerk Add different Payment Instructions');

Scenario('@functional Run once to check multi site payments', async({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.switchSite('LEEDS COUNTY COURT');
  await I.feeclerkPostalOrderPaymentTypeSite1();
  I.see(paymentReferenceSite1);
  await I.switchSite('BROMLEY COUNTY COURT');
  await I.feeclerkPostalOrderPaymentTypeSite2();
  I.see(paymentReferenceSite2);
  I.dontSee(paymentReferenceSite1);
  I.Logout();
}).retry(testConfig.ScenarioRetryLimit);


Scenario('@functional Payment instruction page validation', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.checkAddPaymentInstructionPage();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Postal order payment', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeclerkPostalOrderPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Cash payment', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeclerkCashPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Card payment', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeclerkCardPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Full Remission payment', async({ I }) => {
  I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  I.Logout();
  I.wait(BARATConstants.twoSecondWaitTime);
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  if (fullRemissionEnabled) {
    I.feeclerkRemissionPaymentType();
  }
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Full Remission payment with Fees prompt', async({ I }) => {
  I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  I.Logout();
  I.wait(BARATConstants.twoSecondWaitTime);
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  if (fullRemissionEnabled) {
    I.feeclerkRemissionPaymentTypeAddFeesPrompt();
  }
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Revert payment', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeClerkRevertPayment();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add payment with 2 fees', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeclerkCashPaymentTypeWithTwoFees();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Edit fee', async({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  const paymentInstructionId = await I.feeclerkEditFee();
  // eslint-disable-next-line no-console
  console.log(`paymentInstructionId: ${paymentInstructionId}`);
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add and Edit cheque payment', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  I.feeclerkEditChequePaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Fee Clerk remove Fee', { retries: 2 }, ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  const payerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const paymentAmount = '273';
  const feeSearchDescription = '273';
  const caseNumber = 'IUB87YHQ';
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription });

  I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
