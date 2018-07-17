const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Fee Clerk Add Payment Instruction');

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('i119419@nwytg.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
});

Scenario('Add Payment Instruction', I => {
  I.checkAddPaymentInstructionPage();
});

Scenario('Select Payment Type Cheque', I => {
  I.feeclerkChequePaymentType();
});

Scenario('Select Payment Type Postal Order', I => {
  I.feeclerkPostalOrderPaymentType();
});

Scenario('Select Payment Type Cash', I => {
  I.feeclerkCashPaymentType();
});

Scenario('Select Payment Type All Pay', I => {
  I.feeclerkAllPayPaymentType();
});

Scenario('Select Payment Type Card', I => {
  I.feeclerkCardPaymentType();
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