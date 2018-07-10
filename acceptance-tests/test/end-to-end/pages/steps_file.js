'use strict'
// in this file you can append custom step methods to 'I' object
const jsdom = require('jsdom')
const Factory = require('rosie').Factory
const faker = require('faker')
const ChequePayername = faker.name.firstName()
const PostalOrderPayername = faker.name.firstName()
const CashPayername = faker.name.firstName()
const AllPayPayername = faker.name.firstName()
const CardPayername = faker.name.firstName()
const EditPayername = faker.name.firstName()
const PercentageFee = faker.name.firstName()
const RangeGroupName = faker.name.firstName()
const CategoryName = faker.name.firstName()
const addContext = require('mochawesome/addContext');
addContext(this, 'simple string');

module.exports = function () {

    return actor({
        login: function (email, password) {
            this.fillField('Email address', email)
            this.fillField('Password', password)
            this.waitForElement({css: '[type="submit"]'}, 30)
            this.click({css: '[type="submit"]'})
        },
        paymentTypeCheque: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[1]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[1]/label/div/input'});
            this.wait(2)
            this.see('Cheque number')
            this.fillField('Payer name', ChequePayername)
            this.fillField('Amount', '550')
            this.fillField('Cheque number', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight');
            this.see('Add Payment Instruction')
            this.see('Payment information added')
            this.click({css: '.column-one-half>p>a'});
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(ChequePayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('To Check')
            this.see('Submitted')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(ChequePayername, 10);
            this.see(ChequePayername)
        },
        paymentTypePostalOrder: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[2]/label/div/input'}, 30)
            this.wait(2)
            this.click({xpath: '//div[1]/fieldset/div/div[2]/label/div/input'});
            this.wait(2)
            this.see('Postal order number')
            this.fillField('Payer name', PostalOrderPayername)
            this.fillField('Amount', '550')
            this.fillField('Postal order number', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight')
            this.see('Add Payment Instruction')
            this.see('Payment information added')
            this.click({css: '.column-one-half>p>a'});
            //this.waitForVisible('.modal-window');
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(PostalOrderPayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('To Check')
            this.see('Submitted')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(PostalOrderPayername, 10);
            this.see(PostalOrderPayername)
        },
        paymentTypeCash: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[3]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[3]/label/div/input'});
            this.wait(2)
           // this.see('Cash')
            this.fillField('Payer name', CashPayername)
            this.fillField('Amount', '550')
           // this.fillField('Postal order number', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight');
            this.see('Add Payment Instruction')
            this.see('Payment information added')
            this.click({css: '.column-one-half>p>a'});
            //this.waitForVisible('.modal-window');
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(CashPayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('To Check')
            this.see('Submitted')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(CashPayername, 10);
            this.see(CashPayername)
        },
        paymentTypeAllPay: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[4]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[4]/label/div/input'});
            this.wait(2)
            this.see('AllPay transaction ID')
            this.fillField('Payer name', AllPayPayername)
            this.fillField('Amount', '550')
            this.fillField('AllPay transaction ID', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight');
            this.see('Add Payment Instruction')
            this.see('Payment information added')
            this.click({css: '.column-one-half>p>a'});
            //this.waitForVisible('.modal-window');
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(AllPayPayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('To Check')
            this.see('Submitted')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(AllPayPayername, 10);
            this.see(AllPayPayername)
        },
        paymentTypeCard: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[5]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[5]/label/div/input'});
            this.wait(2)
            this.waitForText('Authorization Code', 10);
            this.see('Authorization Code')
            this.fillField('Payer name', CardPayername)
            this.fillField('Amount', '550')
            this.fillField('Authorization Code', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight');
            this.see('Add Payment Instruction')
            this.see('Payment information added')
            this.click({css: '.column-one-half>p>a'});
            this.wait(2)
            //this.waitForVisible('.modal-window');
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(CardPayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('To Check')
            this.see('Submitted')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(CardPayername, 10);
            this.see(CardPayername)
        },

        editPayerNameAmountAndAuthorizationCode: function () {
            this.waitForText('Check and submit', 10);
          //  this.waitForElement({xpath: '//div[2]/div/ul/li[2]/a'}, 30)
            this.click('Check and submit')
            this.wait(5)
            this.waitForElement({xpath: '//div/table/tbody[1]/tr/td[1]/a'}, 30)
            this.click({xpath: '//div/table/tbody[1]/tr/td[1]/a'});
            this.waitForText('Authorization Code', 10);
            this.see('Authorization Code')
            this.fillField('Payer name', EditPayername)
            this.fillField('Amount', '10000')
            this.fillField('Authorization Code', '123456')
            this.click({css: '[type="submit"]'})
          //  this.waitForVisible('.govuk-box-highlight');
           // this.see('Add Payment Instruction')
           // this.see('Payment information added')
           // this.click({css: '.column-one-half>p>a'});
            //this.waitForVisible('.modal-window');
            //this.click({css: '.modal-link'});
            //this.click('Check and submit')
            this.waitForText(EditPayername, 10);
            this.see('ID')
            this.see('Date')
            this.see('Payer name')
            this.see('Payment type')
            this.see('Amount')
            this.see('Payment Reference')
            this.see('Status')
            this.see('Select')
            this.see('All')
            this.see('Payments Log')
            this.see('Submitted')
            this.see('10,000')
            this.see('123456')
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.waitForText(EditPayername, 10);
            this.see(EditPayername)
        },

        deletePaymentInformation: function () {
            this.waitForText('Check and submit');
            this.click('Check and submit')
            this.wait(2)
            this.waitForElement({xpath: '//div[2]/div/div/div/input'}, 30)
            this.click({xpath: '//div/table/tbody/tr/td[8]/div/input'})
            this.wait(2)
            this.click('Delete');
            this.wait(2)
            this.see(0)

        },

        submitAllPaymentInformation: function () {
            this.waitForElement({xpath: '//div[2]/div/ul/li[2]/a'}, 30)
            this.click({xpath: '//div[2]/div/ul/li[2]/a'})
            this.wait(2)
            this.waitForElement({xpath: '//div/div[1]/div[2]/div[2]/div/button[2]'}, 30)
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')
            this.click({xpath: '//div[2]/div/div/div/input'})
            this.wait(2)
            this.seeElement('.green:enabled')
            this.waitForElement({xpath: '//div/div[1]/div[2]/div[2]/div/button[2]'}, 30)
            this.click({xpath: '//div/div[1]/div[2]/div[2]/div/button[2]'});
            this.wait(2)
            this.seeElement('.gray:disabled')
            this.seeElement('.green:disabled')

          //  addContext(this, 'http://www.url.com/screenshot-maybe.jpg');
           // this.addMochawesomeContext('output');
        },
        feeclerkChequePaymentType: function () {
            this.wait(5)
            this.waitForText('Payment Type', 10);
            this.click({xpath: '//div[1]/fieldset/div/div[1]/label/div/input'});
            this.see('Cheque')
            this.fillField('Payer name', ChequePayername)
            this.fillField('Amount', '550')
            this.fillField('Cheque number', '312323')
            this.click({css: '[type="submit"]'})
            this.wait(2)
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.wait(2)
            this.waitForText(ChequePayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(2)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(ChequePayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.wait(2)
            this.see(0)
        },
        feeclerkPostalOrderPaymentType: function () {
            this.wait(5)
            this.waitForText('Payment Type', 10);
          //  this.waitForElement({xpath: '//div[1]/fieldset/div/div[2]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[2]/label/div/input'});
            this.see('Postal order number')
            this.fillField('Payer name', PostalOrderPayername)
            this.fillField('Amount', '550')
            this.fillField('Postal order number', '312323')
            this.click({css: '[type="submit"]'})
            this.wait(2)
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.wait(2)
            this.waitForText(PostalOrderPayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(2)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
          //  this.click({xpath: '//div/div/form/div[11]/button'})
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(PostalOrderPayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.see(0)
        },

        feeclerkCashPaymentType: function () {
            this.wait(5)
            this.waitForText('Payment Type', 10);
            this.click({xpath: '//div[1]/fieldset/div/div[3]/label/div/input'});
            this.fillField('Payer name', CashPayername)
            this.fillField('Amount', '550')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.waitForText(CashPayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(5)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
           // this.click({xpath: '//div/div/form/div[11]/button'})
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(CashPayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.see(0)
        },

        feeclerkAllPayPaymentType: function () {
            this.wait(5)
            this.waitForText('Payment Type', 10);
            this.click({xpath: '//div[1]/fieldset/div/div[4]/label/div/input'});
            this.see('AllPay transaction ID')
            this.fillField('Payer name', AllPayPayername)
            this.fillField('Amount', '550')
            this.fillField('AllPay transaction ID', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.waitForText(AllPayPayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(2)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
            // this.click({xpath: '//div/div/form/div[11]/button'})
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(AllPayPayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.see(0)
        },

        feeclerkCardPaymentType: function () {
            this.wait(5)
            this.waitForText('Payment Type', 10);
            this.click({xpath: '//div[1]/fieldset/div/div[5]/label/div/input'});
            this.see('Authorization Code')
            this.fillField('Payer name', CardPayername)
            this.fillField('Amount', '550')
            this.fillField('Authorization Code', '312323')
            this.click({css: '[type="submit"]'})
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.waitForText(CardPayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(2)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
          //  this.click({xpath: '//div/div/form/div[11]/button'})
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(CardPayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.see(0)
        },
        feeclerkEditChequePaymentType: function () {
            this.wait(2)
            this.waitForElement({xpath: '//div[1]/fieldset/div/div[1]/label/div/input'}, 30)
            this.click({xpath: '//div[1]/fieldset/div/div[1]/label/div/input'});
            this.wait(2)
            this.see('Cheque number')
            this.fillField('Payer name', ChequePayername)
            this.fillField('Amount', '550')
            this.fillField('Cheque number', '312323')
            this.click({css: '[type="submit"]'})
            this.wait(2)
            this.waitForVisible('.govuk-box-highlight')
            this.click({css: '.button.button-cancel'})
            this.waitForText(ChequePayername, 10);
            this.see('Validate payment')
            this.see('No fee details on payment')
            this.see('Payment details')
            this.wait(5)
            this.click({xpath: '//div/div[4]/table/tbody/tr/td[7]/a'})
          //  this.see('Cheque number')
            this.wait(5)
            this.fillField('Payer name', EditPayername)
            this.fillField('Amount', '10000')
            this.fillField('Cheque number', '123456')
            this.click({css: '[type="submit"]'})
            this.wait(2)
            this.click('Payments list')
            this.wait(2)
            this.click({xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a'})
            this.wait(2)
            this.waitForText(EditPayername, 10);
            this.wait(2)
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','fees order 1.2')
            this.wait(2)
            this.click({xpath: '//div[5]/table/tbody/tr/td[4]/a'})
            this.wait(5)
            this.click('Save')
          //  this.click({xpath: '//div/div/form/div[11]/button'})
            this.wait(2)
            this.click({xpath: '//div/div[5]/table/tbody/tr/td[6]/button'})
            this.fillField('Case number','7657676')
            this.click({xpath: '//div/div/form/div[6]/div[1]/div[2]/a'})
            this.fillField('Search for a Fee','Recovery of Land - High Court')
            this.wait(5)
            this.click({xpath: '//div/div/form/div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
            this.wait(2)
            this.click({xpath: '//div/div[5]/table/tbody/tr/td[6]/div/a'})
            this.wait(5)
            this.waitForText(EditPayername, 10);
            this.click({xpath: '//div/div[2]/div[2]/button'})
            this.wait(2)
            this.fillField('Case number','654321')
            this.fillField('Search for a Fee','Claim Amount - Unspecified')
            this.wait(5)
            this.click({xpath: '//div/div/form/div[5]/table/tbody/tr/td[4]/a'})
            this.wait(2)
            this.click('Save')
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/select'})
            this.waitForElement({xpath: '//div/div[1]/div[2]/div/div/select'}, 30)
            this.wait(2)
            this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
            this.wait(2)
            this.click({xpath: '//div/div[1]/div[2]/div/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/div/ul[1]/li[3]/a'})
            this.wait(2)
            this.see(EditPayername)
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/table/thead/tr/th[11]/div'})
            this.wait(2)
            this.click({xpath: '//div/div[2]/div/div/p/a'})
            this.see('Check and submit')
            this.see(0)
        },
        SeniorFeeClerkCardPaymentType: function () {
            this.waitForText('Anish Fee Clerk Anish Fee Clerk', 10);
           // this.waitForElement({xpath: '//th/a'}, 30)
            this.seeElement({xpath: '//th/a'});
            this.wait(5)
            this.click('Anish Fee Clerk Anish Fee Clerk')
            this.waitForText(ChequePayername, 10);
            this.waitForElement({xpath: '//div/table/thead/tr/th[11]/div/input'}, 30)
            this.click({xpath: '//div/table/thead/tr/th[11]/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/button[2]'})
            this.wait(2)
            this.waitForElement({xpath: '//div[3]/p/a'}, 30)
            this.click({xpath: '//div[2]/div[3]/p/a'})
            this.wait(2)
            this.seeElement({xpath: '//th/a'});
        },
        DeliveryManagerTransferToBAR: function () {
            this.wait(5)
            this.waitForElement({xpath: '//div/table/tbody/tr[1]/th/a'}, 30)
            this.seeElement({xpath: '//div/table/tbody/tr[1]/th/a'});
            this.wait(5)
            this.click('ViswaSenior Fee Clerk Viswa Senior Fee Clerk')
            this.wait(2)
            this.waitForElement({xpath: '//div/table/thead/tr/th[11]/div/input'}, 30)
            this.click({xpath: '//div/table/thead/tr/th[11]/div/input'})
            this.wait(2)
            this.click({xpath: '//div[2]/button[2]'})
            this.wait(2)
            this.waitForElement({xpath: '//div[3]/p/a'}, 30)
            this.click({xpath: '//div[3]/p/a'})
            this.wait(2)
            this.seeElement({xpath: '//tr[2]/th/a'});
        },
    })
}
