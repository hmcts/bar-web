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
const BgcNumber = 354678;
const addContext = require('mochawesome/addContext');

const ctxObject = { test: { context: 'Acceptance Tests' } };
const ctxJson = { title: 'Test Context', value: 'Some Test Context' };

addContext(ctxObject, ctxJson);

module.exports = () => actor({
  login(email, password) {
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
  },
  paymentTypeCheque() {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[1]/fieldset/div/div[1]/label/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[1]/label/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Cheque number');
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.click({ css: '[type="submit"]' });
    this.waitForVisible('.govuk-box-highlight');
    this.see('Add Payment Instruction');
    this.see('Payment information added');
    this.click({ css: '.column-one-half>p>a' });
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('To Check');
    this.see('Submitted');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.see(ChequePayername);
  },
  paymentTypePostalOrder() {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[1]/fieldset/div/div[2]/label/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[2]/label/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Postal order number');
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.click({ css: '[type="submit"]' });
    this.waitForVisible('.govuk-box-highlight');
    this.see('Add Payment Instruction');
    this.see('Payment information added');
    this.click({ css: '.column-one-half>p>a' });
    // this.waitForVisible('.modal-window');
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('To Check');
    this.see('Submitted');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.see(PostalOrderPayername);
  },
  paymentTypeCash() {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[1]/fieldset/div/div[3]/label/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[3]/label/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    // this.see('Cash')
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    // this.fillField('Postal order number', '312323')
    this.click({ css: '[type="submit"]' });
    this.waitForVisible('.govuk-box-highlight');
    this.see('Add Payment Instruction');
    this.see('Payment information added');
    this.click({ css: '.column-one-half>p>a' });
    // this.waitForVisible('.modal-window');
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('To Check');
    this.see('Submitted');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.see(CashPayername);
  },
  paymentTypeAllPay() {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[1]/fieldset/div/div[4]/label/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[4]/label/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.click({ css: '[type="submit"]' });
    this.waitForVisible('.govuk-box-highlight');
    this.see('Add Payment Instruction');
    this.see('Payment information added');
    this.click({ css: '.column-one-half>p>a' });
    // this.waitForVisible('.modal-window');
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('To Check');
    this.see('Submitted');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.see(AllPayPayername);
  },
  paymentTypeCard() {
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForElement({ xpath: '//div[1]/fieldset/div/div[5]/label/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[5]/label/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.click({ css: '[type="submit"]' });
    this.waitForVisible('.govuk-box-highlight');
    this.see('Add Payment Instruction');
    this.see('Payment information added');
    this.click({ css: '.column-one-half>p>a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    // this.waitForVisible('.modal-window');
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('To Check');
    this.see('Submitted');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.see(CardPayername);
  },

  editPayerNameAmountAndAuthorizationCode() {
    this.waitForText('Check and submit', BARATConstants.tenSecondWaitTime);
    //  this.waitForElement({xpath: '//div[2]/div/ul/li[2]/a'}, BARATConstants.thirtySecondWaitTime)
    this.click('Check and submit');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForElement({ xpath: '//div/table/tbody[1]/tr/td[1]/a' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div/table/tbody[1]/tr/td[1]/a' });
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorization Code', '123456');
    this.click({ css: '[type="submit"]' });
    //  this.waitForVisible('.govuk-box-highlight');
    // this.see('Add Payment Instruction')
    // this.see('Payment information added')
    // this.click({css: '.column-one-half>p>a'});
    // this.waitForVisible('.modal-window');
    // this.click({css: '.modal-link'});
    // this.click('Check and submit')
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    this.see('ID');
    this.see('Date');
    this.see('Payer name');
    this.see('Payment type');
    this.see('Amount');
    this.see('Payment Reference');
    this.see('Status');
    this.see('Select');
    this.see('All');
    this.see('Payments Log');
    this.see('Submitted');
    this.see('10,000');
    this.see('123456');
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    this.see(EditPayername);
  },

  deletePaymentInformation() {
    this.see('Check and submit');
    this.click('Check and submit');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[2]/div/div/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div/table/tbody/tr/td[8]/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Delete');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(0);
  },

  submitAllPaymentInformation() {
    this.waitForElement({ xpath: '//div[2]/div/ul/li[2]/a' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul/li[2]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div[2]/div/button[2]' }, BARATConstants.thirtySecondWaitTime);
    this.seeElement('.gray:disabled');
    this.seeElement('.green:disabled');
    this.seeElement({ xpath: '//div/div[2]/div/div/div/input' });
    this.checkOption({ xpath: '//div/div[2]/div/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.seeElement('.green:enabled');
    this.click({ xpath: '//div/div[1]/div[2]/div[2]/div/button[2]' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.dontSeeElement({ xpath: '//div/form/div/div/div/table/tbody[1]/tr/td[8]/div/input' });
  },
  checkAddPaymentInstructionPage() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
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
  feeclerkChequePaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[1]/label/div/input' });
    this.see('Cheque');
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(ChequePayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(0);
  },
  feeclerkPostalOrderPaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[2]/label/div/input' });
    this.see('Postal order number');
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    //  this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(PostalOrderPayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.see(0);
  },

  feeclerkCashPaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[3]/label/div/input' });
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    // this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(CashPayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.see(0);
  },

  feeclerkAllPayPaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[4]/label/div/input' });
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    // this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(AllPayPayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.see(0);
  },

  feeclerkCardPaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[5]/label/div/input' });
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    //  this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(CardPayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.see(0);
  },
  feeclerkEditChequePaymentType() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[1]/label/div/input' });
    this.see('Cheque');
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.click({ xpath: '//div/div[4]/table/tbody/tr/td[7]/a' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Cheque number');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Cheque number', '123456');
    this.click({ css: '[type="submit"]' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Payments list');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    //  this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[5]/table/tbody/tr/td[6]/button' });
    this.fillField('Case number', '7657676');
    this.click({ xpath: '//div/div/form/div[6]/div[1]/div[2]/a' });
    this.fillField('Search for a Fee', 'Recovery of Land - High Court');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/form/div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[5]/table/tbody/tr/td[6]/div/a' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'Claim Amount - Unspecified');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/form/div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(EditPayername);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/table/thead/tr/th[11]/div' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div/div/p/a' });
    this.see('Check and submit');
    this.see(0);
  },
  SeniorFeeClerkCardPaymentType() {
    this.waitForText('Anish feeclerk', BARATConstants.tenSecondWaitTime);
    // this.waitForElement({xpath: '//th/a'}, BARATConstants.thirtySecondWaitTime)
    this.seeElement({ xpath: '//th/a' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click('Anish feeclerk');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div[2]/div[3]/div[1]/app-card/div/div[1]/p' });
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ xpath: '//div/table/thead/tr/th[11]/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div/table/thead/tr/th[11]/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/button[2]' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.fillField('bgc-number', BgcNumber);
    this.click({ xpath: '//app-hmcts-modal/div/div/div/div[2]/p/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSeeElement({ xpath: '//div/div[3]/div/div/div/div/table/tbody/tr' });
  },
  DeliveryManagerTransferToBAR() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('krishna Srfeeclerk', BARATConstants.thirtySecondWaitTime);
    this.see('krishna Srfeeclerk');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click('krishna Srfeeclerk');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div/div[2]/div[2]/div[3]/div/app-card/div' }, BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div[2]/div[2]/div[3]/div/app-card/div' });
    this.waitForElement({ xpath: '//div/table/thead/tr/th[11]/div/input' }, BARATConstants.thirtySecondWaitTime);
    this.click({ xpath: '//div/table/thead/tr/th[11]/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/button[2]' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement({ xpath: '//div[3]/p/a' }, BARATConstants.thirtySecondWaitTime);
    this.dontSeeElement({ xpath: '//div/div[3]/div/div/div/div/table/tbody/tr' });
  },
  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log-out');
    this.click('Log-out');
    this.wait(BARATConstants.fiveSecondWaitTime);
  }
});
