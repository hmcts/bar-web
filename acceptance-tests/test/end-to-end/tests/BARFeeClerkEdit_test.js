const Feature = require('ui');
const Before = require('ui');
const Scenario = require('ui');

Feature('BAR Fee Clerk Edit and Remove Payment Instruction');

const waitTime = 5;
const windowX = 1600;
const windowY = 1200;

Before(I => {
  I.amOnPage('/');
  I.resizeWindow(windowX, windowY);
  I.login('i119419@nwytg.com', 'LevelAt12');
  I.wait(waitTime);
  I.click('Add payment information');
});

/* Scenario('Add Payment Instruction', I => {

  I.see('Add Payment Instruction')
  I.see('Payment Type')
  I.waitForElement({css: '[type="radio"]'}, 30)
  I.see('Cheque')
  I.see('Cash')
  I.see('Postal Order')
  I.see('AllPay')
  I.see('Card')
  I.see('Payer name')
  I.see('Amount')
  I.seeElement('.button.button-view:disabled');
})
*/
Scenario('Select Payment Type Cheque', I => {
  I.feeclerkEditChequePaymentType();
});


/* Scenario('View Payments Log Validations', I => {
  I.seeElement('.button.button-blue');
I.click({css: '#payment-type-1'})
I.click({css: '#payment-type-2'})
I.click({css: '#payment-type-3'})
I.click({css: '#payment-type-4'})
I.click({css: '#payment-type-5'})
I.click({css: '#payment-type-6'})
I.seeElement('.button.button-blue.view-payment-log-disabled');
})

Scenario('View Payments Log Validations With PayeeName', I => {
  I.seeElement('.button.button-blue');
I.fillField('#payee-name', 'john');
//I.fillField('Amount*', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
})

Scenario('View Payments Log Validations With Amount', I => {
  I.seeElement('.button.button-blue');
I.fillField('#amount', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
})*/