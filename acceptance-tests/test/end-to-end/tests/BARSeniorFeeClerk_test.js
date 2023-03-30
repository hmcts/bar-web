/* eslint-disable */
const BARATConstants = require('./BARAcceptanceTestConstants');

const testConfig = require('../config/BARConfig');

let paymentInstructionId;

Feature('BAR Sr Fee Clerk Tests');

BeforeSuite(async({ I }) => {
  const paymentInstructionAndCaseFeeIds = await I.createCardPaymentWithCaseFeeDetailsAndSubmitByFeeClerkUsingApi(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword, 'Y264');
  paymentInstructionId = paymentInstructionAndCaseFeeIds.get('payment_instruction_id');
  I.wait(2);
});

Scenario('@functional @crossbrowser Payments Overview', async({ I }) => {
  await I.login(testConfig.TestBarSeniorFeeClerkUserName, testConfig.TestBarSeniorFeeClerkPassword);
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.see('Payments overview');
  I.see('User');
  I.see('Role');
  I.see('Carry Forward');
  I.see('Validated payments');
  I.see('Yet to submit');
  I.see('Submitted');
  I.see('Carry forward');
  I.see('Ready to review');
  I.see('Recorded Today');
  I.see('Pending');
  I.dontSee('Transfer to BAR');
  I.see('Validated');
  I.see('Pending Review');
  I.see('Pending Approval');
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional senior-fee-clerk approve payment', async({ I }) => {
  await I.login(testConfig.TestBarSeniorFeeClerkUserName, testConfig.TestBarSeniorFeeClerkPassword);
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.fiveSecondWaitTime);
  await I.switchSite('LEEDS COUNTY COURT');
  await I.SeniorFeeClerkApprovePayment('card', paymentInstructionId);
  await I.Logout();
  I.clearCookie();
}).retry(testConfig.ScenarioRetryLimit);
