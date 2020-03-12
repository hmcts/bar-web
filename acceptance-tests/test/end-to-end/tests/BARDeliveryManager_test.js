/* eslint-disable no-console */
const BARATConstants = require('./BARAcceptanceTestConstants');

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

Feature('BAR Delivery Manager and Sr Fee Clerk Tests');

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});

Scenario('Assign users to site and turn on features', I => {
  let token = null;
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.seeAuthentication()
    .then(authToken => {
      token = authToken;
      return I.assignUsersToSite(emailsBromley, sites.bromley, authToken);
    })
    .then(resp => console.log(resp))
    .then(() => I.assignUsersToSite(emailsMilton, sites.milton, token))
    .then(resp => console.log(resp))
    .then(() => {
      I.amOnPage('/features');
      I.waitForElement('#send-to-payhub', BARATConstants.fiveSecondWaitTime);
      I.turnAllFeatureOn();
      I.click('Save');
    })
    .then(() => I.Logout())
    .catch(error => {
      console.log(error);
      I.Logout();
    });
});

Scenario('FeeClerk Click and Submit', I => {
  I.login('barpreprodfeeclerk1@mailinator.com', 'LevelAt12');
  I.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
  I.click('Add payment');
  I.waitForText('AllPay', BARATConstants.tenSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.feeclerkCardPaymentType();
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('barpreprodsrfeeclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
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
});

Scenario('Payments Pending Review and Approve', I => {
  I.SeniorFeeClerkApprovePayment('cheque');
  I.click('Payments overview');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.see('Payments overview');
  I.SeniorFeeClerkApprovePayment('card');
  I.Logout();
});

Scenario('Payments Pending review', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Reviewed');
  I.see('Rejected');
  I.see('Approved');
  I.see('Carry forward');
  I.see('Ready to transfer to BAR');
  I.see('Recorded Today');
  I.see('Pending review');
  // I.see('Transfer to BAR');
  I.see('Validated');
  I.see('Recorded Today');
  I.see('Pending');
  I.see('Transferred to BAR');
  I.see('Pending Review');
  I.see('Pending Approval');
});

Scenario('Transfer to BAR', { retries: 2 }, I => {
  I.DeliveryManagerTransferToBAR();
});

Scenario('Trying to confirm transfer to BAR when feature is disabled', I => {
  I.amOnPage('/features');
  I.wait(BARATConstants.tenSecondWaitTime);
  I.waitForElement('#send-to-payhub', BARATConstants.tenSecondWaitTime);
  I.toggleSendToPayhubFeature(false);
  I.click('Save');
  I.DeliveryManagerConfirmTransferToBAR('This function is temporarily unavailable.');
});

Scenario('User admin console', I => {
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
});

Scenario('Confirm transfer to BAR', I => {
  if (testSendToPayhub) {
    I.amOnPage('/features');
    I.waitForElement('#send-to-payhub', BARATConstants.tenSecondWaitTime);
    I.toggleSendToPayhubFeature(true);
    I.click('Save');
    I.DeliveryManagerConfirmTransferToBAR('successful');
  }
  I.Logout();
});
