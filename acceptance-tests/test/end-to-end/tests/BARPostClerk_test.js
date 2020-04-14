const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Add Payment Instruction').retry(BARATConstants.testRetry);

Scenario('Add Payment Instruction', async I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.thirtySecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled()
  I.Logout();

  I.login('barpreprodpostclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Add payment', BARATConstants.thirtySecondWaitTime);
  I.retry(BARATConstants.retryCountForStep).waitForText('Add payment', BARATConstants.thirtySecondWaitTime);
  I.see('Add payment');
  I.see('Payment type');
  I.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
  I.see('Cheque');
  I.see('Cash');
  I.see('Postal Order');
  I.see('AllPay');
  I.see('Card');
  I.see('Payer name');
  I.see('Amount');
  I.seeElement('.button.button-view:enabled');

  I.paymentTypeCheque('PostClerk');

  I.paymentTypePostalOrder('PostClerk');

  I.paymentTypeCash('PostClerk');

  I.paymentTypeAllPay('PostClerk');

  I.paymentTypeCard('PostClerk');

  I.editPayerNameAmountAndAuthorizationCode('PostClerk');

  if (fullRemissionEnabled) {
    I.paymentTypeRemission('PostClerk');
  } else {
    I.checkFullRemissionIsNotVisible();
  }

  I.deletePaymentInformation('PostClerk');

  I.Logout();
});
