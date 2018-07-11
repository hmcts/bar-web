const { Feature, Before, Scenario } = require('ui');

Feature('BAR Senoir Fee Clerk Pending Review');

const wait2 = 2;
const wait5 = 5;
const waitTime = 10;
const windowX = 1600;
const windowY = 1200;

Before(I => {
  I.amOnPage('/');
  I.resizeWindow(windowX, windowY);
});
Scenario('FeeClerk Click and Submit', I => {
  I.login('i119419@nwytg.com', 'LevelAt12');
  I.waitForText('Add payment information', waitTime);
  I.click('Add payment information');
  I.wait(wait2);
  I.feeclerkChequePaymentType();
});

Scenario('Payments Overview', I => {
  I.login('i234148@nwytg.com', 'LevelAt12');
  I.waitForText('Payments overview', waitTime);
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
});

Scenario('Payments Pending Review and Approve', I => {
  I.login('i234148@nwytg.com', 'LevelAt12');
  I.wait(wait5);
  I.waitForText('Anish Fee Clerk Anish Fee Clerk', waitTime);
  // I.waitForElement({xpath: '//th/a'}, 30)
  // I.
  I.SeniorFeeClerkCardPaymentType();
});

/* Scenario('View Payments Log Validations', (I) => {
    I.seeElement('.button.button-blue');
I.click({css: '#payment-type-1'})
I.click({css: '#payment-type-2'})
I.click({css: '#payment-type-3'})
I.click({css: '#payment-type-4'})
I.click({css: '#payment-type-5'})
I.click({css: '#payment-type-6'})
I.seeElement('.button.button-blue.view-payment-log-disabled');
})

Scenario('View Payments Log Validations With PayeeName', (I) => {
    I.seeElement('.button.button-blue');
I.fillField('#payee-name', 'john');
//I.fillField('Amount*', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
})

Scenario('View Payments Log Validations With Amount', (I) => {
    I.seeElement('.button.button-blue');
I.fillField('#amount', '123456');
I.seeElement('.button.button-blue.view-payment-log-disabled');
})*/