Feature('BAR Delivery Manager')

Before((I, Idam) => {
    I.amOnPage('/');
    I.resizeWindow(1600,1200);
})
Scenario('FeeClerk Click and Submit', (I) => {
    I.login('i119419@nwytg.com', 'LevelAt12');
    I.wait(5)
    I.click('Add payment information');
    I.wait(5)
    I.feeclerkChequePaymentType();
})

Scenario('Payments Overview', (I) => {
    I.login('i234148@nwytg.com', 'LevelAt12');
    I.wait(5)
    I.see('Payments overview')
    I.see('Reporting')
    I.see('User')
    I.see('Role')
    I.see('Carry Forward')
    I.see('Validated payments')
    I.see('Yet to submit')
    I.see('Submitted')
    I.see('Carry forward')
    I.see('Ready to review')
    I.see('Recorded')
    I.see('Pending transfer')
    I.see('Transfer to BAR')
    I.see('validated')
    I.see('ready to review')
    I.see('approved')
    I.see('transferred to BAR')
})

Scenario('Payments Pending Review and Approve', (I) => {
    I.login('i234148@nwytg.com', 'LevelAt12');
    I.wait(5)
    I.SeniorFeeClerkCardPaymentType();
})

Scenario('Payments Pending review', (I) => {
    I.login('bar.superuser@gmail.com', 'LevelAt12');
    I.wait(5)
    I.see('Payments overview')
    I.see('Reporting')
    I.see('User')
    I.see('Role')
    I.see('Reviewed')
    I.see('Rejected')
    I.see('Approved')
    I.see('Carry forward')
    I.see('Ready to transfer to BAR')
   // I.see('Ready to review')
    I.see('Recorded')
    I.see('Pending review')
    I.see('Transfer to BAR')
    I.see('validated')
    I.see('ready to review')
    I.see('approved')
    I.see('transferred to BAR')
})

Scenario('Transfer to BAR', (I) => {
    I.login('bar.superuser@gmail.com', 'LevelAt12');
    I.wait(5)
    I.DeliveryManagerTransferToBAR();
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