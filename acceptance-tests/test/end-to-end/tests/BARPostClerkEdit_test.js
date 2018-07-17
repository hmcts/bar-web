const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Edit Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('i118030@nwytg.com', 'LevelAt12');
});

Scenario('Select Payment Type Card', I => {
  I.waitForText('Add Payment Instruction', BARATConstants.tenSecondWaitTime);
  I.paymentTypeCard();
});

Scenario('Edit Card Payment', I => {
  I.editPayerNameAmountAndAuthorizationCode();
  I.Logout();
});
