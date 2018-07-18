const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Senoir Fee Clerk Pending Review');

Before(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});
Scenario('FeeClerk Click and Submit', I => {
  I.login('i119419@nwytg.com', 'LevelAt12');
  I.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
  I.see('Add payment information');
  I.click('Add payment information');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('i234148@nwytg.com', 'LevelAt12');
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
  I.see('Recorded');
  I.see('Pending transfer');
  I.see('Transfer to BAR');
  I.see('validated');
  I.see('ready to review');
  I.see('approved');
  I.see('transferred to BAR');
  I.Logout();
});

Scenario('Payments Pending Review and Approve', I => {
  I.login('i234148@nwytg.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.waitForText('Anish Fee Clerk Anish Fee Clerk', BARATConstants.tenSecondWaitTime);
  // I.waitForElement({xpath: '//th/a'}, 30)
  // I.
  I.SeniorFeeClerkCardPaymentType();
  I.Logout();
});
