const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Delivery Manager and Sr Fee Clerk Tests');

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});
Scenario('FeeClerk Click and Submit', I => {
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Add payment information', BARATConstants.nintySecondWaitTime);
  I.click('Add payment information');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('barpreprodsrfeeclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.thirtySecondWaitTime);
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
  I.see('Recorded');
  I.see('Pending transfer');
  I.see('Transfer to BAR');
  I.see('validated');
  I.see('ready to review');
  I.see('approved');
  I.see('transferred to BAR');
});

Scenario('Payments Pending Review and Approve', I => {
  I.SeniorFeeClerkCardPaymentType();
  I.Logout();
});

Scenario('Payments Pending review', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.thirtySecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Reviewed');
  I.see('Rejected');
  I.see('Approved');
  I.see('Carry forward');
  I.see('Ready to transfer to BAR');
  I.see('Recorded');
  I.see('Pending review');
  I.see('Transfer to BAR');
  I.see('validated');
  I.see('ready to review');
  I.see('approved');
  I.see('transferred to BAR');
});

Scenario('Transfer to BAR', I => {
  I.DeliveryManagerTransferToBAR();
});

Scenario('Confirm transfer to BAR', I => {
  I.DeliveryManagerConfirmTransferToBAR();
  I.Logout();
});