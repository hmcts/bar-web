const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Delivery Manager');

Before(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});
Scenario('FeeClerk Click and Submit', I => {
  I.login('i119419@nwytg.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.click('Add payment information');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('i234148@nwytg.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
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
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.SeniorFeeClerkCardPaymentType();
  I.Logout();
});

Scenario('Payments Pending review', I => {
  I.login('bar.superuser@gmail.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Reviewed');
  I.see('Rejected');
  I.see('Approved');
  I.see('Carry forward');
  I.see('Ready to transfer to BAR');
  // I.see('Ready to review')
  I.see('Recorded');
  I.see('Pending review');
  I.see('Transfer to BAR');
  I.see('validated');
  I.see('ready to review');
  I.see('approved');
  I.see('transferred to BAR');
});

Scenario('Transfer to BAR', I => {
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.DeliveryManagerTransferToBAR();
  I.Logout();
});
