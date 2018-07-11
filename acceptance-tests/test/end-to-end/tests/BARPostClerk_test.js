const Feature = require('ui');
const Before = require('ui');
const Scenario = require('ui');

Feature('BAR Post Clerk Add Payment Instruction');

const waitTime = 10;
const waitTimeForElement = 30;
const windowX = 1600;
const windowY = 1200;

Before(I => {
  I.amOnPage('/');
  I.resizeWindow(windowX, windowY);
  I.login('i1180waitTimeForElement@nwytg.com', 'LevelAt12');
});

Scenario('Add Payment Instruction', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.see('Add Payment Instruction');
  I.see('Payment Type');
  I.waitForElement({ css: '[type="radio"]' }, waitTimeForElement);
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
  I.waitForText('Add Payment Instruction', waitTime);
  I.paymentTypeCheque();
});

Scenario('Select Payment Type Postal Order', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.paymentTypePostalOrder();
});

Scenario('Select Payment Type Cash', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.paymentTypeCash();
});

Scenario('Select Payment Type All Pay', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.paymentTypeAllPay();
});

Scenario('Select Payment Type Card', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.paymentTypeCard();
});

Scenario('Submit Card Payment', I => {
  I.waitForText('Add Payment Instruction', waitTime);
  I.submitAllPaymentInformation();
});
/* Scenario('View Payments Log Validations', I => {
  I.seeElement('.button.button-blue');
I.click({css: '#payment-type-1'});
I.click({css: '#payment-type-2'});
I.click({css: '#payment-type-3'});
I.click({css: '#payment-type-4'});
I.click({css: '#payment-type-5'});
I.click({css: '#payment-type-6'});
I.seeElement('.button.button-blue.view-payment-log-disabled');
});

Scenario('View Payments Log Validations With PayeeName', I => {
  I.seeElement('.button.button-blue');
I.fillField('#payee-name', 'john');
//I.fillField('Amount*', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
});

Scenario('View Payments Log Validations With Amount', I => {
  I.seeElement('.button.button-blue');
I.fillField('#amount', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
});*/