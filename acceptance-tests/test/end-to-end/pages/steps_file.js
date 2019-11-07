'use strict';
const BARATConstants = require('../tests/BARAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
const faker = require('faker');

// const ChequePayername = faker.name.firstName();
const ChequePayername = 'santosh';
const PostalOrderPayername = faker.name.firstName();
const CashPayername = faker.name.firstName();
const AllPayPayername = faker.name.firstName();
const CardPayername = faker.name.firstName();
const EditPayername = faker.name.firstName();
const PostalOrderPayernameSite1 = 'Mr POPayer Site1';
const PostalOrderPayernameSite2 = 'Mr Payer Site2';
const RemissionPayerName = `${faker.name.firstName()} ${new Date().getTime()}`;
const remissionReference = '12345678901';
// faker.random.number({ min: 100000, max: 1000000 });
const BgcNumber = '0000';
const addContext = require('mochawesome/addContext');

const FOUR = 4;

const ctxObject = { test: { context: 'Acceptance Tests' } };
const ctxJson = { title: 'Test Context', value: 'Some Test Context' };

const paymentTypes = {
  card: {
    id: '#payment_type_CARD',
    reference: 'Authorisation Code'
  },
  cheque: {
    id: '#payment_type_CHEQUE',
    reference: 'Cheque number'
  },
  cash: { id: '#payment_type_CASH' },
  postal: {
    id: '#payment_type_POSTAL_ORDER',
    reference: 'Postal order number'
  },
  allPay: {
    id: '#payment_type_ALLPAY',
    reference: 'AllPay transaction ID'
  }
};

addContext(ctxObject, ctxJson);

module.exports = () => actor({
  // done
  login(email, password) {
    this.amOnPage('/');
    this.retry(BARATConstants.retryCountForStep).waitForElement('#username', BARATConstants.thirtySecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
  },
  // done
  paymentTypeCheque(role) {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323', role);
    this.checkAndSubmit(ChequePayername, 'Submit');
  },
  // done
  paymentTypePostalOrder(role) {
    this.createPayment(paymentTypes.postal, PostalOrderPayername, '550', '312323', role);
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
  },
  // done
  paymentTypeCash(role) {
    this.createPayment(paymentTypes.cash, CashPayername, '550', null, role);
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  paymentTypeAllPay(role) {
    this.createPayment(paymentTypes.allPay, AllPayPayername, '550', '1231231231231231231', role);
    this.checkAndSubmit(AllPayPayername, 'Submit');
  },
  // done
  paymentTypeCard(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.checkAndSubmit(CardPayername, 'Submit');
  },
  paymentTypeRemission(role) {
    this.createRemission(role, RemissionPayerName);
    this.checkAndSubmit(RemissionPayerName, 'Submit');
  },
  // done
  editPayerNameAmountAndAuthorizationCode(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.click('Check and submit');
    this.waitForElement('#paymentInstructionModel0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstructionModel0');
    this.waitForText('Authorisation Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorisation Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorisation Code', '123456');
    this.waitForElement('.button-view', BARATConstants.tenSecondWaitTime);
    this.click('Save changes');
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  deletePaymentInformation(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.checkAndSubmit(CardPayername, 'Delete');
  },
  // done
  checkAddPaymentInstructionPage() {
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.see('Payment type');
    this.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
    this.see('Cheque');
    this.see('Cash');
    this.see('Postal Order');
    this.see('AllPay');
    this.see('Card');
    this.see('Payer name');
    this.see('Amount');
    this.seeElement('.button.button-view:enabled');
    this.checkValidation();
  },
  // done
  feeclerkChequePaymentType() {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(ChequePayername, 'Submit');
  },
  // done
  feeclerkPostalOrderPaymentType() {
    this.createPayment(paymentTypes.postal, PostalOrderPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
  },
  // done
  feeclerkPostalOrderPaymentTypeSite1() {
    this.createPayment(paymentTypes.postal, PostalOrderPayernameSite1, '234567', '454545');
    this.click('Payments list');
    this.waitForText(PostalOrderPayernameSite1, BARATConstants.tenSecondWaitTime);
    this.see('454545');
  },
  // done
  feeclerkCashPaymentTypeSite2() {
    this.createPayment(paymentTypes.postal, PostalOrderPayernameSite2, '456789', '232323');
    this.click('Payments list');
    this.waitForText(PostalOrderPayernameSite2, BARATConstants.tenSecondWaitTime);
    this.see('232323');
  },
  // done
  feeclerkCashPaymentType() {
    this.createPayment(paymentTypes.cash, CashPayername, '550');
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  feeclerkCashPaymentTypeWithTwoFees() {
    this.createPayment(paymentTypes.cash, CashPayername, '550');
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.addMultipleFeeAndCaseWithJurisdictions('Civil Court fees - Money Claims - Claim Amount - 300.01', '654323', 'civil', 'county_court');
    this.waitForElement('#add-case-fee-details', BARATConstants.tenSecondWaitTime);
    this.click('#add-case-fee-details');
    this.addMultipleFeeAndCaseWithJurisdictions('Hearing fees', '654323', 'family', 'court_of_protection');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  feeclerkAllPayPaymentType() {
    this.createPayment(paymentTypes.allPay, AllPayPayername, '550', '1231231231231231231');
    this.click('Payments list');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(AllPayPayername, 'Submit');
  },
  // done
  feeclerkCardPaymentType() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CardPayername, 'Submit');
  },
  feeclerkRemissionPaymentType() {
    this.createRemission('FeeClerk', RemissionPayerName);
    this.click('Payments list');
    this.waitForText(RemissionPayerName, BARATConstants.tenSecondWaitTime);
    this.see(remissionReference);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('fees order 1.2', '654321');
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
  },
  feeclerkRemissionPaymentTypeAddFeesPrompt() {
    this.createRemission('FeeClerk', RemissionPayerName, true);
    this.editFeeAndCaseNumberAndSave('fees order 1.2', '654321');
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
  },
  feeclerkEditFee() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.waitForText('654321', BARATConstants.tenSecondWaitTime);
    this.click('#fee-details > tbody > tr > td.bar-feelogs-td.text-align-right > button');
    this.click('#feedetail-component > div > form > div.current-fee > div.header > div:nth-child(2) > a');
    this.editFeeAndCaseNumberAndSave('upto 1000 GBP', '123456');
    this.waitForText('123456', BARATConstants.tenSecondWaitTime);
    this.waitForText('upto 1000 GBP', BARATConstants.tenSecondWaitTime);
  },
  // done
  feeclerkEditChequePaymentType() {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement({ css: 'a.button' }, BARATConstants.tenSecondWaitTime);
    this.click('Edit');
    this.waitForText('Edit payment', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Cheque number', '123456');
    this.click('Save changes');
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },

  SeniorFeeClerkApprovePayment(type) {
    let payerName = '';
    let cardId = '';
    if (type === 'cheque') {
      payerName = ChequePayername;
      cardId = '#merged';
    } else if (type === 'card') {
      payerName = CardPayername;
      cardId = '#CARD';
    }
    this.waitForText('Anish feeclerk', BARATConstants.tenSecondWaitTime);
    this.click('Anish feeclerk');
    this.waitForElement(cardId, BARATConstants.tenSecondWaitTime);
    this.click(cardId);
    this.waitForText(payerName, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-0');
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.tenSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Approve');
    if (type === 'cheque') {
      this.waitForElement('#bgc-number', BARATConstants.tenSecondWaitTime);
      this.fillField('#bgc-number', BgcNumber);
      this.click('Confirm');
    }
    this.wait(BARATConstants.tenSecondWaitTime);
    this.dontSee(payerName);
  },
  // done
  DeliveryManagerTransferToBAR() {
    this.waitForText('krishna Srfeeclerk', BARATConstants.thirtySecondWaitTime);
    this.click('krishna Srfeeclerk');
    this.waitForText('Payments to review', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#BGC310000', BARATConstants.thirtySecondWaitTime);
    this.click('#BGC310000');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.tenSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.waitForElement('#approve', BARATConstants.twoSecondWaitTime);
    this.click('#approve');
    this.wait(BARATConstants.tenSecondWaitTime);
    this.dontSee(ChequePayername);
    this.dontSeeCheckboxIsChecked('#payment-instruction-all');
  },
  DeliveryManagerConfirmTransferToBAR(textToWait) {
    this.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
    this.click('Payments overview');
    this.waitForText('Reviewer', BARATConstants.tenSecondWaitTime);
    this.click('Transfer to BAR');
    this.waitForText('Approver', BARATConstants.tenSecondWaitTime);
    this.click('Confirm BAR transfers');
    this.waitForElement('#transferDate', BARATConstants.tenSecondWaitTime);
    this.click('Cancel');
    this.click('Confirm BAR transfers');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Confirm');
    this.waitForText(textToWait, BARATConstants.tenSecondWaitTime);
    this.click('#submitModal');
    this.wait(BARATConstants.tenSecondWaitTime);
  },
  feeClerkRevertPayment() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.click('Check and submit');
    this.waitForElement('#paymentInstruction0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstruction0');
    this.waitForText('Change to Pending status', BARATConstants.tenSecondWaitTime);
  },
  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log out');
    this.click('Log out');
    this.wait(BARATConstants.tenSecondWaitTime);
  },
  switchSite() {
    this.moveCursorTo('//div/div/ul[2]/li[1]/a');
    this.see('BROMLEY COUNTY COURT');
    this.see('MILTON KEYNES COUNTY COURT');
    this.click('//*[@id="sites-drop-down"]/li/a');
    this.waitForText('COURT', BARATConstants.tenSecondWaitTime);
  },
  /**
   * @private
   * @param {string} feeText
   * @param {string} caseNumber
   */
  editFeeAndCaseNumberAndSave(feeText, caseNumber) {
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', caseNumber);
    this.fillField('Search for a Fee', feeText);
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForElement(`//tr[td[contains(text(),"${feeText}")]]//a`, BARATConstants.tenSecondWaitTime);
    this.click(`//tr[td[contains(text(),"${feeText}")]]//a`);
    this.waitForElement('#save', BARATConstants.tenSecondWaitTime);
    this.click('Save');
  },
  /**
   * @private
   * @param {string} feeText
   * @param {string} caseNumber
   */
  addMultipleFeeAndCaseWithJurisdictions(feeText, caseNumber, juris1, juris2) {
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', caseNumber);
    this.click('#jurisdiction1Select');
    this.click(`#${juris1}`);
    this.click('#jurisdiction2Select');
    this.click(`#${juris2}`);
    this.fillField('Search for a Fee', feeText);
    this.wait(BARATConstants.tenSecondWaitTime);
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.tenSecondWaitTime);
    this.click('Save');
  },
  /**
   * @private
   * @param {object} paymentType
   * @param {string} payerName
   * @param {string} amount
   * @param {string} reference
   */
  createPayment(paymentType, payerName, amount, reference, role) {
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.fillPaymentDetails(paymentType, payerName, amount, reference, role);
  },

  createRemission(role, payerName, addFeeNow) {
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.waitForText('Add a full remission payment here', BARATConstants.tenSecondWaitTime);
    this.click('Add a full remission payment here');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#remission-reference');
    this.see('Add Full remission payment instruction');
    this.click('Add remission');
    this.see('Enter applicant name');
    this.see('Enter remission reference');
    this.fillField('#payer-name', payerName);
    this.fillField('#remission-reference', remissionReference);
    this.dontSee('Enter applicant name');
    this.dontSee('Enter remission reference');
    this.click('Add remission');
    this.wait(BARATConstants.tenSecondWaitTime);
    let linkName = '';
    if (addFeeNow) {
      linkName = 'Continue to Payment ID';
    } else if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.waitForText(linkName, BARATConstants.tenSecondWaitTime);
    this.click(linkName);
    if (!addFeeNow) {
      this.retry(FOUR).waitForText(payerName, BARATConstants.tenSecondWaitTime);
    }
  },
  /**
   * Selects the chosen payment type and fills out the required fields
   * @private
   * @param {string} paymentType
   * @param {string} payerName
   * @param {string} amount
   * @param {string} reference
   */
  fillPaymentDetails(paymentType, payerName, amount, reference, role) {
    this.waitForElement(paymentType.id, BARATConstants.tenSecondWaitTime);
    this.click(paymentType.id);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    if (reference) {
      this.see(paymentType.reference);
    }
    this.fillField('Payer name', payerName);
    this.fillField('Amount', amount);
    if (reference) {
      this.fillField(paymentType.reference, reference);
    }
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('#instruction-submit');
    this.wait(BARATConstants.tenSecondWaitTime);
    let linkName = '';
    if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.waitForText(linkName, BARATConstants.tenSecondWaitTime);
    this.click(linkName);
    this.retry(FOUR).reloadIfTextNotFound(payerName, BARATConstants.tenSecondWaitTime);
  },
  /**
   * Navigates to check and submit section and submits all the available payments
   * @private
   * @param {string} payerName
   */
  checkAndSubmit(payerName, action) {
    this.click('Check and submit');
    this.waitForText(payerName, BARATConstants.tenSecondWaitTime);
    this.click(`//td[contains(text(), '${payerName}')]/parent::*/td[last()]//input`);
    this.click(action);
    this.see('Check and submit');
  },
  /**
   * Selects the first item from the payment list and clicks to see the details
   * @private
   */
  navigateValidateScreenAndClickAddFeeDetails() {
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
  },
  /**
   * Starts the selected action on the payment-instruction item
   * @param {string} actionName
   */
  doActionOnPaymentInstruction(actionName) {
    this.waitForElement(`#${actionName}`, BARATConstants.tenSecondWaitTime);
    this.click(`#${actionName}`);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Submit');
    this.waitForText('Payments list', BARATConstants.thirtySecondWaitTime);
  },

  checkIfFullRemissionEnabled() {
    this.amOnPage('/features');
    this.waitForElement('#full-remission', BARATConstants.tenSecondWaitTime);
    return this.grabAttributeFrom('#full-remission', 'checked');
  },

  checkFullRemissionIsNotVisible() {
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.dontSee('Add Full remission payment instruction');
  },

  checkValidation() {
    // click to see error messages
    this.click('#instruction-submit');
    this.see('Select a payment type');
    this.see('Enter payer name');
    this.see('Enter payment amount');
    // select card
    this.click(paymentTypes.card.id);
    this.dontSee('Select a payment type');
    this.see('Enter card authorisation code');
    // select postal
    this.click(paymentTypes.postal.id);
    this.see('Enter postal order number');
    // select all-pay
    this.click(paymentTypes.allPay.id);
    this.see('Enter AllPay transaction ID');
    // select cheque
    this.click(paymentTypes.cheque.id);
    this.see('Enter cheque number');
    this.fillField('Payer name', 'a');
    this.see('Payer name must be 3 characters or more');
    this.dontSee('Enter payer name');
    this.fillField('Payer name', 'abc');
    this.dontSee('Payer name must be 3 characters or more');
    this.dontSee('Enter payer name');
    this.fillField('Amount', '10000');
    this.dontSee('Enter payment amount');
    this.fillField('Cheque number', '1');
    this.see('Cheque number must be 6 characters');
    this.fillField('Cheque number', '123456');
    this.dontSee('Cheque number must be 6 characters');
    this.dontSee('Enter cheque number');
  }

});
