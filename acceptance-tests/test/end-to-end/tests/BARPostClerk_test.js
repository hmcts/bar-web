const BARATConstants = require('./BARAcceptanceTestConstants');

let fullRemissionEnabled = false;

Feature('BAR Post Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});

Scenario('Run once to check full remission', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  I.checkIfFullRemissionEnabled()
    .then(val => {
      fullRemissionEnabled = val;
      I.Logout();
    });
});

Scenario('Add Payment Instruction', I => {
  I.login('barpreprodpostclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Add Payment Instruction', BARATConstants.tenSecondWaitTime);
  I.retry(BARATConstants.retryCountForStep).waitForText('Add Payment Instruction', BARATConstants.thirtySecondWaitTime);
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

Scenario('Select Payment Type Cheque', { retries: 2 }, I => {
  I.paymentTypeCheque('PostClerk');
  // I.paymentTypeChequeForPostClerk();
});

Scenario('Select Payment Type Postal Order', I => {
  I.paymentTypePostalOrder('PostClerk');
});

Scenario('Select Payment Type Cash', { retries: 2 }, I => {
  I.paymentTypeCash('PostClerk');
});

Scenario('Select Payment Type All Pay', { retries: 2 }, I => {
  I.paymentTypeAllPay('PostClerk');
});

Scenario('Select Payment Type Card', { retries: 2 }, I => {
  I.paymentTypeCard('PostClerk');
});

Scenario('Create Full remission', { retries: 2 }, I => {
  if (fullRemissionEnabled) {
    I.paymentTypeRemission('PostClerk');
  } else {
    I.checkFullRemissionIsNotVisible();
  }
});

Scenario('Edit Card Payment', { retries: 2 }, I => {
  I.editPayerNameAmountAndAuthorizationCode('PostClerk');
});

Scenario('Delete Card Payment', { retries: 2 }, I => {
  I.deletePaymentInformation('PostClerk');
  I.Logout();
});
