Feature('BAR Post Clerk Submit Payment Instruction')

Before((I, Idam) => {
    I.amOnPage('/');
    I.resizeWindow(1600, 1200);
    I.login('i118030@nwytg.com', 'LevelAt12');
    I.waitForText('Add Payment Instruction', 10);
   // I.addMochawesomeContext('simple string');
})

Scenario('Select Payment Type Card', (I) => {
    I.paymentTypeCard();
})

Scenario('Submit Card Payment', (I) => {
    I.submitAllPaymentInformation();
})
/*Scenario('View Payments Log Validations', (I) => {
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