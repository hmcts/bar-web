/* eslint-disable no-console, max-len */
const BARATConstants = require('./BARAcceptanceTestConstants');

const testConfig = require('../config/BARConfig');

Feature('BAR Sr Fee Clerk Tests');

BeforeSuite(async({ I }) => {
  await I.createPaymentWithCaseFeeDetailsAndSubmitByFeeClerkUsingApi(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword, 'Y431');
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
  await I.switchSite('BROMLEY COUNTY COURT');
  await I.SeniorFeeClerkApprovePayment('cheque');
  await I.Logout();
  I.clearCookie();
}).retry(testConfig.ScenarioRetryLimit);
