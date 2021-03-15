/* eslint-disable no-console */
const BARATConstants = require('./BARAcceptanceTestConstants');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('BARDeliveryManager_test.js');

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

Feature('BAR Delivery Manager and Sr Fee Clerk Tests').retry(BARATConstants.testRetry);

Scenario('Assign users to site and turn on features', async I => {
  let token = null;
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.twelveSecondWaitTime);
  await I.seeAuthentication()
    .then(authToken => {
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
});

Scenario('FeeClerk Click and Submit', I => {
  I.login('barpreprodfeeclerk1@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.feeclerkCardPaymentType();
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('barpreprodsrfeeclerk@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.see('Payments overview');
  // I.see('Reporting');
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
  I.Logout();
});

Scenario('Payments Pending Review and Approve', I => {
  I.login('barpreprodfeeclerk1@mailinator.com', 'LevelAt12');
  I.feeclerkChequePaymentType();
  I.feeclerkCardPaymentType();
  I.Logout();

  I.login('barpreprodsrfeeclerk@mailinator.com', 'LevelAt12');
  I.SeniorFeeClerkApprovePayment('cheque');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.click('Payments overview');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.SeniorFeeClerkApprovePayment('card');
  I.Logout();
});

Scenario('Payments Pending review', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
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
  I.Logout();
});

Scenario('Transfer to BAR', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.DeliveryManagerTransferToBAR();
  I.Logout();
});

Scenario('Trying to confirm transfer to BAR when feature is disabled', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.amOnPage('/features');
  I.wait(BARATConstants.twelveSecondWaitTime);
  I.waitForElement('#send-to-payhub', BARATConstants.twelveSecondWaitTime);
  I.disablePayhubFeature();
  I.DeliveryManagerConfirmTransferToBAR('This function is temporarily unavailable.');
  I.Logout();
});

Scenario('User admin console', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
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
  I.Logout();
});

Scenario('Confirm transfer to BAR', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  if (testSendToPayhub) {
    I.amOnPage('/features');
    I.wait(BARATConstants.twelveSecondWaitTime);
    I.waitForElement('#send-to-payhub', BARATConstants.twelveSecondWaitTime);
    I.enablePayhubFeature();
    I.DeliveryManagerConfirmTransferToBAR('successful');
  }
  I.Logout();
});
