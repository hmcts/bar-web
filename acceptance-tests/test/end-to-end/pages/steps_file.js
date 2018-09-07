'use strict';
const BARATConstants = require('../tests/BARAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
const faker = require('faker');

const ChequePayername = faker.name.firstName();
const PostalOrderPayername = faker.name.firstName();
const CashPayername = faker.name.firstName();
const AllPayPayername = faker.name.firstName();
const CardPayername = faker.name.firstName();
const EditPayername = faker.name.firstName();
// faker.random.number({ min: 100000, max: 1000000 });
const BgcNumber = '354678';
const addContext = require('mochawesome/addContext');

const ctxObject = { test: { context: 'Acceptance Tests' } };
const ctxJson = { title: 'Test Context', value: 'Some Test Context' };

addContext(ctxObject, ctxJson);

module.exports = () => actor({
  // done
  login(email, password) {
    this.waitForElement('#username', BARATConstants.thirtySecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
    this.wait(BARATConstants.fiveSecondWaitTime);
  },
  // done
  paymentTypeCheque() {
    this.waitForElement('#payment_type_CHEQUE', BARATConstants.fiveSecondWaitTime);
    this.click('#payment_type_CHEQUE');
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypePostalOrder() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_POSTAL_ORDER', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_POSTAL_ORDER');
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('Postal order number');
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeCash() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CASH', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CASH');
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeAllPay() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_ALLPAY', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_ALLPAY');
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeCard() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CARD', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CARD');
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  editPayerNameAmountAndAuthorizationCode() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CARD', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CARD');
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForElement('#paymentInstructionModel0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstructionModel0');
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorization Code', '123456');
    this.waitForElement('.button-view', BARATConstants.tenSecondWaitTime);
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  deletePaymentInformation() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CARD', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CARD');
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Delete');
    this.see('Check and submit');
  },
  // done
  checkAddPaymentInstructionPage() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.see('Payment Type');
    this.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
    this.see('Cheque');
    this.see('Cash');
    this.see('Postal Order');
    this.see('AllPay');
    this.see('Card');
    this.see('Payer name');
    this.see('Amount');
    this.seeElement('.button.button-view:disabled');
  },
  // done
  feeclerkChequePaymentType() {
    this.waitForElement('#payment_type_CHEQUE', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CHEQUE');
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkPostalOrderPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_POSTAL_ORDER', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_POSTAL_ORDER');
    this.see('Postal order number');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(PostalOrderPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkCashPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CASH', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CASH');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CashPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkAllPayPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_ALLPAY', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_ALLPAY');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(AllPayPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkCardPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CARD', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CARD');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkEditChequePaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CHEQUE', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CHEQUE');
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement({ css: 'a.button' }, BARATConstants.tenSecondWaitTime);
    this.click('Edit');
    this.waitForText('Edit Payment Instruction', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Cheque number', '123456');
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  SeniorFeeClerkCardPaymentType() {
    this.waitForText('Anish feeclerk', BARATConstants.tenSecondWaitTime);
    this.click('Anish feeclerk');
    this.waitForElement('#cheques', BARATConstants.fiveSecondWaitTime);
    this.click('#cheques');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Approve');
    this.waitForElement('#bgc-number', BARATConstants.fiveSecondWaitTime);
    this.fillField('#bgc-number', BgcNumber);
    this.click('Confirm');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
  },
  // done
  DeliveryManagerTransferToBAR() {
    this.waitForText('krishna Srfeeclerk', BARATConstants.thirtySecondWaitTime);
    this.click('krishna Srfeeclerk');
    this.waitForText('Payments to review', BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#cheques354678', BARATConstants.fiveSecondWaitTime);
    this.click('#cheques354678');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('#transfer-to-bar');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
    this.dontSeeCheckboxIsChecked('#payment-instruction-all');
  },
  feeClerkRevertPayment() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement('#payment_type_CARD', BARATConstants.thirtySecondWaitTime);
    this.click('#payment_type_CARD');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForElement('#paymentInstruction0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstruction0');
    this.waitForText('Revert to Pending status', BARATConstants.fiveSecondWaitTime);
  },
  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log-out');
    this.click('Log-out');
    this.wait(BARATConstants.fiveSecondWaitTime);
  }
});
