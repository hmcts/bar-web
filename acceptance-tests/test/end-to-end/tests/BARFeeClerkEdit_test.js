const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Fee Clerk Edit and Remove Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
});

Scenario('Select Payment Type Cheque', I => {
  I.feeclerkEditChequePaymentType();
  I.Logout();
});
