Feature('BAR Post Clerk Add Payment Instruction')

Before((I, Idam) => {
    I.amOnPage('/');
    I.resizeWindow(1600, 1200);
    I.login('i118030@nwytg.com', 'LevelAt12');
})

Scenario('Add Payment Instruction', (I) => {
    I.waitForText('Add Payment Instruction', 10);
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

Scenario('Select Payment Type Cheque', (I) => {
    I.waitForText('Add Payment Instruction', 10);
    I.paymentTypeCheque();
})

Scenario('Select Payment Type Postal Order', (I) => {
    I.waitForText('Add Payment Instruction', 10);
    I.paymentTypePostalOrder();
})

Scenario('Select Payment Type Cash', (I) => {
    I.waitForText('Add Payment Instruction', 10);
    I.paymentTypeCash();
})

Scenario('Select Payment Type All Pay', (I) => {
    I.waitForText('Add Payment Instruction', 10);
    I.paymentTypeAllPay();
})

Scenario('Select Payment Type Card', (I) => {
    I.waitForText('Add Payment Instruction', 10);
    I.paymentTypeCard();
})

Scenario('Submit Card Payment', (I) => {
    I.waitForText('Add Payment Instruction', 10);
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