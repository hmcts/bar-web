const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('i118030@nwytg.com', 'LevelAt12');
});

Scenario('Add Payment Instruction', I => {
  I.waitForText('Add Payment Instruction', BARATConstants.tenSecondWaitTime);
  I.see('Add Payment Instruction');
  I.see('Payment Type');
  I.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
  I.see('Cheque');
  I.see('Cash');
  I.see('Postal Order');
  I.see('AllPay');
  I.see('Card');
  I.see('Payer name');
  I.see('Amount');
  I.seeElement('.button.button-view:disabled');
});

Scenario('Submit Card Payment', I => {
  I.waitForText('Add Payment Instruction', BARATConstants.tenSecondWaitTime);
  I.submitAllPaymentInformation();
  I.Logout();
});
