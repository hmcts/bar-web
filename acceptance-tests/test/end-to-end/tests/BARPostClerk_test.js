const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('barpreprodpostclerk@mailinator.com', 'LevelAt12');
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

Scenario('Select Payment Type Cheque', I => {
  I.paymentTypeCheque();
});

Scenario('Select Payment Type Postal Order', I => {
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click({ xpath: '//div[2]/div/ul/li[1]/a' });
  I.paymentTypePostalOrder();
});

Scenario('Select Payment Type Cash', I => {
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click({ xpath: '//div[2]/div/ul/li[1]/a' });
  I.paymentTypeCash();
});

Scenario('Select Payment Type All Pay', I => {
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click({ xpath: '//div[2]/div/ul/li[1]/a' });
  I.paymentTypeAllPay();
});

Scenario('Select Payment Type Card', I => {
  I.wait(BARATConstants.twoSecondWaitTime);
  I.click({ xpath: '//div[2]/div/ul/li[1]/a' });
  I.paymentTypeCard();
});

Scenario('Submit Card Payment', I => {
  I.wait(BARATConstants.twoSecondWaitTime);
  I.submitAllPaymentInformation();
  I.Logout();
});
