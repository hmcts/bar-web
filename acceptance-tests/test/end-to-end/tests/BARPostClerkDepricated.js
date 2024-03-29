const BARATConstants = require('./BARAcceptanceTestConstants');
const testConfig = require('../config/BARConfig');

Feature('BAR Post Clerk Add Payment Instruction').retry(BARATConstants.testRetry);

Scenario('@functional Add Payment Instruction', async({ I }) => {
  I.login(testConfig.TestBarDeliveryManagerUserName, testConfig.TestBarDeliveryManagerPassword);
  I.waitForText('Payments overview', BARATConstants.twelveSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  I.Logout();

  I.login(testConfig.TestBarPostClerkUserName, testConfig.TestBarPostClerkPassword);
  I.wait(BARATConstants.tenSecondWaitTime);
  I.see('Add payment');
  I.see('Payment type');
  I.waitForElement({ css: '[type="radio"]' }, BARATConstants.twelveSecondWaitTime);
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
}).retry(testConfig.ScenarioRetryLimit);
