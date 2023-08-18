/* eslint-disable max-len */
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
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.switchSite('LEEDS COUNTY COURT');
  await I.feeclerkPostalOrderPaymentTypeSite1();
  I.see(paymentReferenceSite1);
  await I.switchSite('BROMLEY COUNTY COURT');
  await I.feeclerkPostalOrderPaymentTypeSite2();
  I.see(paymentReferenceSite2);
  I.dontSee(paymentReferenceSite1);
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);


Scenario('@functional Payment instruction page validation', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.checkAddPaymentInstructionPage();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Postal order payment', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkPostalOrderPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Cash payment', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkCashPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Card payment', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkCardPaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Full Remission payment', async({ I }) => {
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  await I.Logout();
  I.clearCookie();
  I.wait(BARATConstants.twoSecondWaitTime);
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  if (fullRemissionEnabled) {
    await I.feeclerkRemissionPaymentType();
  }
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add Full Remission payment with Fees prompt', async({ I }) => {
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  await I.Logout();
  I.clearCookie();
  I.wait(BARATConstants.twoSecondWaitTime);
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  if (fullRemissionEnabled) {
    await I.feeclerkRemissionPaymentTypeAddFeesPrompt();
  }
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Revert payment', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeClerkRevertPayment();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add payment with 2 fees', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkCashPaymentTypeWithTwoFees();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Edit fee', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkEditFee();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Add and Edit cheque payment', async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  await I.waitForCourtDropDownField();
  await I.feeclerkEditChequePaymentType();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Fee Clerk remove Fee', { retries: 2 }, async({ I }) => {
  await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  const payerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const paymentAmount = '273';
  const feeSearchDescription = '273';
  const caseNumber = 'IUB87YHQ';
  await I.waitForCourtDropDownField();
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription });

  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
