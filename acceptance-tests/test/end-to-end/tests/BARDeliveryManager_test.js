/* eslint-disable */
const BARATConstants = require('./BARAcceptanceTestConstants');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('BARDeliveryManager_test.js');
const testConfig = require('../config/BARConfig');


const testSendToPayhub = true;

const emailsBromley = [
  'barpreprod@mailinator.com', 'barpreprodsrfeeclerk@mailinator.com', 'barpreprodfeeclerk1@mailinator.com',
  'barpreprodpostclerk@mailinator.com', 'SiteSwitchDM@mailnesia.com', 'SiteSwitchFee@mailnesia.com',
  'SiteSwitchPost@mailnesia.com'
];
const emailsMilton = [
  'site2feeclerk@mailinator.com', 'SiteSwitchDM@mailnesia.com', 'SiteSwitchFee@mailnesia.com',
  'SiteSwitchPost@mailnesia.com'
];
const sites = { bromley: 'Y431', milton: 'Y610' };

Feature('BAR Delivery Manager Tests');

BeforeSuite(async({ I }) => {
  const paymentInstructionAndCaseFeeIds = await I.createChequePaymentWithCaseFeeDetailsAndSubmitByFeeClerkUsingApi(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword, 'Y431');
  const paymentInstructionId = paymentInstructionAndCaseFeeIds.get('payment_instruction_id');
  await I.approveChequePaymentInstructionBySeniorFeeClerkUsingApi(testConfig.TestBarSeniorFeeClerkUserName, testConfig.TestBarSeniorFeeClerkPassword, 'Y431', paymentInstructionId);
});

Scenario('@functional Assign users to site and turn on features', async({ I }) => {
  let token = null;
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.AcceptBarWebCookies();
  await I.seeAuthentication()
    .then(({ authToken }) => {
      token = authToken;
      logger.log('auth token is: ', authToken);
      return I.assignUsersToSite(emailsBromley, sites.bromley, authToken);
    })
    .then(resp => logger.log('bromley response', resp))
    .then(() => I.assignUsersToSite(emailsMilton, sites.milton, token))
    .then(resp => logger.log('milton response', resp))
    .then(() => {
      I.amOnPage('/features');
      I.wait(BARATConstants.twelveSecondWaitTime);
      I.waitForElement('#send-to-payhub', BARATConstants.twelveSecondWaitTime);
      I.turnAllFeatureOn();
      I.click('Save');
    })
    .then(() => I.Logout())
    .catch(() => {
      logger.log('error');
    });
}).retry(testConfig.ScenarioRetryLimit);

// Payments Pending Review and Approve --> e2e journey fee-clerk, sr-fee-clerk, manager
// ticket for addressing this test issues on PR and nightly builds PAY-5929
Scenario('@functional fee-clerk Add Payments, senior-fee-clerk approve, delivery-manager transfer to BAR and send to payhub', async({ I }) => {
  // await I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  // I.wait(BARATConstants.tenSecondWaitTime);
  // I.waitForText('Payments list', BARATConstants.fiveSecondWaitTime);
  // await I.switchSite('BROMLEY COUNTY COURT');
  // await I.feeclerkChequePaymentType();
  // await I.Logout();
  // I.clearCookie();
  // I.wait(BARATConstants.twoSecondWaitTime);

  // await I.login(testConfig.TestBarSeniorFeeClerkUserName, testConfig.TestBarSeniorFeeClerkPassword);
  // I.wait(BARATConstants.twelveSecondWaitTime);
  // I.waitForText('Payments overview', BARATConstants.fiveSecondWaitTime);
  // await I.switchSite('BROMLEY COUNTY COURT');
  // await I.SeniorFeeClerkApprovePayment('cheque');
  // await I.Logout();
  // I.clearCookie();
  // I.wait(BARATConstants.twoSecondWaitTime);

  // Due to the slow responsiveness of the bar-web app, payment creation done using api as it's been already covered in fee clerk tests.

  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTimeSecondWaitTime);
  await I.switchSite('BROMLEY COUNTY COURT');
  I.DeliveryManagerTransferToBAR();
  if (testSendToPayhub) {
    I.amOnPage('/features');
    I.wait(BARATConstants.fiveSecondWaitTime);
    I.waitForElement('#send-to-payhub', BARATConstants.fiveSecondWaitTime);
    I.enablePayhubFeature();
    I.DeliveryManagerConfirmTransferToBAR('successful');
  }
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Payments Pending review', async({ I }) => {
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.RejectBarWebCookies();
  I.see('Payments overview');
  // I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Reviewed');
  I.see('Rejected');
  I.see('Approved');
  I.see('Carry forward');
  I.see('Ready to transfer to BAR');
  I.see('Recorded Today');
  I.see('Pending Review');
  // I.see('Transfer to BAR');
  I.see('Validated');
  I.see('Recorded Today');
  I.see('Pending');
  I.see('Transferred to BAR');
  I.see('Pending Review');
  I.see('Pending Approval');
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional Trying to confirm transfer to BAR when feature is disabled', async({ I }) => {
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  await I.switchSite('BROMLEY COUNTY COURT');
  I.amOnPage('/features');
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.waitForElement('#send-to-payhub', BARATConstants.twelveSecondWaitTime);
  I.disablePayhubFeature();
  I.DeliveryManagerConfirmTransferToBAR('This function is temporarily unavailable.');
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

Scenario('@functional @crossbrowser User admin console', async({ I }) => {
  await I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.amOnPage('/user-admin');
  I.see('Manage users');
  I.see('Add or change a user');
  I.see('You can add a new user or change their role.');
  I.see('Add or change user role');
  I.see('You can add a user to this court');
  I.see('Assign user');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.click('#add-user-modal');
  I.see('Email');
  I.see('Add user');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.addNewUser();
  await I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
