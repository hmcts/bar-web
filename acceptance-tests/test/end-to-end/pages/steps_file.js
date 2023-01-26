'use strict';
const BARATConstants = require('../tests/BARAcceptanceTestConstants');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('BARDeliveryManager_test.js');

// const logger = Logger.getLogger('BARDeliveryManager_test.js');
// in this file you can append custom step methods to 'I' object
const faker = require('faker');

const AddUserName = faker.name.firstName().toUpperCase();
const ChequePayername = faker.name.firstName();
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

const TWO = 2;

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
  async login(email, password) {
    this.amOnPage('/');
    await this.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.wait(BARATConstants.twoSecondWaitTime);
    await this.click({ css: '[type="submit"]' });
    this.wait(BARATConstants.fiveSecondWaitTime);
  },

  AcceptBarWebCookies() {
    this.waitForText('Cookies on bar-web', BARATConstants.fiveSecondWaitTime);
    this.click({ css: 'button.cookie-banner-accept-button' });
    this.click({ css: 'div.cookie-banner-accept-message > div.govuk-button-group > button' });
    this.wait(BARATConstants.twoSecondWaitTime);
  },

  RejectBarWebCookies() {
    this.waitForText('Cookies on bar-web', BARATConstants.fiveSecondWaitTime);
    this.click({ css: 'button.cookie-banner-reject-button' });
    this.click({ css: 'div.cookie-banner-reject-message > div.govuk-button-group > button' });
    this.wait(BARATConstants.twoSecondWaitTime);
  },
  // done
  async paymentTypeCheque(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.cheque, ChequePayername, '273', '312323', role);
    this.checkAndSubmit(ChequePayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async paymentTypePostalOrder(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.postal, PostalOrderPayername, '273', '312323', role);
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async paymentTypeCash(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.cash, CashPayername, '273', null, role);
    this.checkAndSubmit(CashPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async paymentTypeAllPay(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.allPay, AllPayPayername, '273', '1231231231231231231', role);
    this.checkAndSubmit(AllPayPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async paymentTypeCard(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323', role);
    this.checkAndSubmit(CardPayername, 'Submit');
    return paymentInstructionId;
  },
  paymentTypeRemission(role) {
    this.createRemission(role, RemissionPayerName);
    this.checkAndSubmit(RemissionPayerName, 'Submit');
  },
  // done
  async editPayerNameAmountAndAuthorizationCode(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323', role);
    this.click('Check and submit');
    this.waitForElement('#paymentInstructionModel0', BARATConstants.twelveSecondWaitTime);
    this.click('#paymentInstructionModel0');
    this.waitForText('Authorisation Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorisation Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorisation Code', '123456');
    this.waitForElement('.button-view', BARATConstants.tenSecondWaitTime);
    this.click('Save changes');
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
  },
  // done
  async deletePaymentInformation(role) {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323', role);
    this.checkAndSubmit(CardPayername, 'Delete');
    return paymentInstructionId;
  },
  // done
  async checkAddPaymentInstructionPage() {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.retry(BARATConstants.retryCountForStep).click('Add payment');
    this.see('Payment type');
    await this.waitForElement({ css: '[type="radio"]' }, BARATConstants.twelveSecondWaitTime);
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
  async feeclerkChequePaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.cheque, ChequePayername, '273', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(ChequePayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async feeclerkPostalOrderPaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.postal, PostalOrderPayername, '273', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async feeclerkPostalOrderPaymentTypeSite1() {
    const paymentInstructionId = await this.createPayment(paymentTypes.postal, PostalOrderPayernameSite1, '234567', '454545');
    this.see('454545');
    return paymentInstructionId;
  },
  // done
  async feeclerkPostalOrderPaymentTypeSite2() {
    const paymentInstructionId = await this.createPayment(paymentTypes.postal, PostalOrderPayernameSite2, '456789', '232323');
    this.see('232323');
    return paymentInstructionId;
  },
  // done
  async feeclerkCashPaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.cash, CashPayername, '273');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(CashPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async feeclerkCashPaymentTypeWithTwoFees() {
    const paymentInstructionId = await this.createPayment(paymentTypes.cash, CashPayername, '544');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.addMultipleFeeAndCaseWithJurisdictions('Civil Court fees - Money Claims - Claim Amount - 300.01', '654323', 'civil', 'county_court');
    this.waitForElement('#add-case-fee-details', BARATConstants.tenSecondWaitTime);
    this.click('#add-case-fee-details');
    this.addMultipleFeeAndCaseWithJurisdictions('Hearing fees', '654323', 'family', 'court_of_protection');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(CashPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async feeclerkAllPayPaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.allPay, AllPayPayername, '273', '1231231231231231231');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(AllPayPayername, 'Submit');
    return paymentInstructionId;
  },
  // done
  async feeclerkCardPaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.checkAndSubmit(CardPayername, 'Submit');
    this.wait(BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
  },
  async feeclerkRemissionPaymentType() {
    const paymentInstructionId = await this.createRemission('FeeClerk', RemissionPayerName);
    this.click('Payments list');
    this.waitForText(RemissionPayerName, BARATConstants.tenSecondWaitTime);
    this.see(remissionReference);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.retry(TWO).see('Application for a grant of probate (Estate over 5000 GBP)');
    return paymentInstructionId;
  },
  async feeclerkRemissionPaymentTypeAddFeesPrompt() {
    const paymentInstructionId = await this.createRemission('FeeClerk', RemissionPayerName, true);
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.retry(TWO).see('Application for a grant of probate (Estate over 5000 GBP)');
    return paymentInstructionId;
  },
  async feeclerkEditFee() {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.waitForText('654321', BARATConstants.tenSecondWaitTime);
    this.click('#fee-details > tbody > tr > td.bar-feelogs-td.text-align-right > button');
    this.click('#feedetail-component > div > form > div.current-fee > div.header > div:nth-child(2) > a');
    this.editFeeAndCaseNumberAndSave('Copy of a document', '123456');
    this.waitForText('123456', BARATConstants.tenSecondWaitTime);
    this.waitForText('Copy of a document', BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
  },
  // done
  async feeclerkEditChequePaymentType() {
    const paymentInstructionId = await this.createPayment(paymentTypes.cheque, ChequePayername, '273', '312323');
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
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
    this.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
  },

  getDateInDDMMYYYY() {
    const stringFillSize = 2;
    const date = new Date();
    const day = date.getDate()
      .toString()
      .padStart(stringFillSize, '0');
    const month = (date.getMonth() + 1).toString()
      .padStart(stringFillSize, '0');
    const year = date.getFullYear()
      .toString();
    return `${day}${month}${year}`;
  },

  getTimeInHHMMSS() {
    const stringFillSize = 2;
    const date = new Date();
    const hour = date.getHours()
      .toString()
      .padStart(stringFillSize, '0');
    const min = (date.getMinutes()).toString()
      .padStart(stringFillSize, '0');
    const sec = date.getSeconds()
      .toString();
    return `${hour}${min}${sec}`;
  },

  async SeniorFeeClerkApprovePayment(type) {
    let payerName = '';
    let paymentTypeId = '';
    if (type === 'cheque') {
      payerName = ChequePayername;
      paymentTypeId = '#merged';
    } else if (type === 'card') {
      payerName = CardPayername;
      paymentTypeId = '#CARD';
    }

    if (process.env.TEST_URL.includes('demo')) {
      await this.click('bar user');
    } else if (process.env.TEST_URL.includes('aat') || process.env.TEST_URL.includes('-pr-')) {
      await this.click('Anish feeclerk');
    }
    this.wait(BARATConstants.twelveSecondWaitTime);
    this.click(paymentTypeId);
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(payerName, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.twelveSecondWaitTime);
    this.click('#payment-instruction-0');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.tenSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.twelveSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.twelveSecondWaitTime);
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
    if (process.env.TEST_URL.includes('demo')) {
      this.waitForText('firstName lastName', BARATConstants.twelveSecondWaitTime);
      this.click('firstName lastName');
    } else if (process.env.TEST_URL.includes('aat') || process.env.TEST_URL.includes('-pr-')) {
      this.waitForText('krishna Srfeeclerk', BARATConstants.twelveSecondWaitTime);
      this.click('krishna Srfeeclerk');
    }
    this.waitForText('Payments to review', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#BGC310000', BARATConstants.twelveSecondWaitTime);
    this.click('#BGC310000');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.twelveSecondWaitTime);
    this.click('#payment-instruction-0');
    this.waitForText('Validate payment', BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.tenSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.twelveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.waitForElement('#approve', BARATConstants.twoSecondWaitTime);
    this.click('#approve');
    this.wait(BARATConstants.tenSecondWaitTime);
    this.dontSee(ChequePayername);
    this.dontSeeCheckboxIsChecked('#payment-instruction-all');
  },
  DeliveryManagerConfirmTransferToBAR(textToWait) {
    const todayDate = this.getDateInDDMMYYYY();
    this.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
    this.click('Payments overview');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Transfer to BAR', BARATConstants.tenSecondWaitTime);
    this.click('Transfer to BAR');
    this.waitForText('Approver', BARATConstants.tenSecondWaitTime);
    this.click('Submit');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement('#transferDate', BARATConstants.tenSecondWaitTime);
    this.click('Cancel');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Submit');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForElement('#transferDate', BARATConstants.tenSecondWaitTime);
    this.fillField('//*[@id="transferDate"]', todayDate);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Confirm');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(textToWait, BARATConstants.tenSecondWaitTime);
    this.click('#submitModal');
    this.wait(BARATConstants.fiveSecondWaitTime);
  },
  async feeClerkRevertPayment() {
    const paymentInstructionId = await this.createPayment(paymentTypes.card, CardPayername, '273', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('Estate over 5000 GBP', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.click('Check and submit');
    this.waitForElement('#paymentInstruction0', BARATConstants.twelveSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Change to Pending status', BARATConstants.tenSecondWaitTime);
    this.click('Change to Pending status');
    this.waitForElement('#Process', BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
  },
  async Logout() {
    this.scrollPageToTop();
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log out');
    await this.click('//*[@class = "logout-btn"]').catch(() => logger.info('ERROR'));
  },
  async switchSite(siteToSwitchTo) {
    const currentSite = await this.grabTextFrom('//*[@class = "dropdown"]');
    if (currentSite.toString().indexOf(siteToSwitchTo) === -1) {
      this.moveCursorTo('//div/div/ul[2]/li[1]/a');
      this.waitForText(siteToSwitchTo, BARATConstants.tenSecondWaitTime);
      this.say(`Swapping to site: ${siteToSwitchTo}`);
      await this.click(siteToSwitchTo);
      this.wait(BARATConstants.fiveSecondWaitTime);
      this.waitForText('COURT', BARATConstants.tenSecondWaitTime);
    }
  },
  /**
   * @private
   * @param {string} feeText
   * @param {string} caseNumber
   * @param jurisdiction1
   * @param jurisdiction2
   */
  editFeeAndCaseNumberAndSave(feeText, caseNumber, jurisdiction1 = 'family', jurisdiction2 = 'probate_registry') {
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('#case-reference', caseNumber);
    this.click('#jurisdiction1Select');
    this.waitForElement(`#${jurisdiction1}`, BARATConstants.fiveSecondWaitTime);
    this.click(`#${jurisdiction1}`);
    this.click('#jurisdiction2Select');
    this.waitForElement(`#${jurisdiction2}`, BARATConstants.fiveSecondWaitTime);
    this.click(`#${jurisdiction2}`);
    this.fillField('Search for a Fee', feeText);
    // click outside the fee lookup field
    this.click('#feeSelectorSection');
    this.wait(BARATConstants.fiveSecondWaitTime);
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
  async createPayment(paymentType, payerName, amount, reference, role) {
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Add payment', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.twoSecondWaitTime);
    // eslint-disable-next-line max-len
    const paymentInstructionId = await this.fillPaymentDetails(paymentType, payerName, amount, reference, role);
    return paymentInstructionId;
  },

  async createRemission(role, payerName, addFeeNow) {
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
    let linkName = '';
    if (addFeeNow) {
      linkName = 'Continue to Payment ID';
    } else if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.waitForText(linkName, BARATConstants.tenSecondWaitTime);
    const paymentInstructionId = await this.grabTextFrom('//*[@id=\'content\']/app-payment-instruction/div/div/div/div[1]/h2');
    this.click(linkName);
    if (!addFeeNow) {
      this.retry(TWO).waitForText(payerName, BARATConstants.tenSecondWaitTime);
    }
    return paymentInstructionId;
  },
  /**
   * Selects the chosen payment type and fills out the required fields
   * @private
   * @param {string} paymentType
   * @param {string} payerName
   * @param {string} amount
   * @param {string} reference
   */
  async fillPaymentDetails(paymentType, payerName, amount, reference, role) {
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
    let linkName = '';
    if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.wait(BARATConstants.tenSecondWaitTime);
    this.see(linkName);
    const paymentInstructionId = await this.grabTextFrom('//*[@id=\'content\']/app-payment-instruction/div/div/div/div[1]/h2');
    this.click(linkName);
    this.wait(BARATConstants.tenSecondWaitTime);
    return paymentInstructionId;
    // this.reloadIfTextNotFound(payerName, BARATConstants.tenSecondWaitTime);
  },
  /**
   * Navigates to check and submit section and submits all the available payments
   * @private
   * @param {string} payerName
   * @param {string} action to take
   */
  checkAndSubmit(payerName, action) {
    this.click('Check and submit');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(payerName, BARATConstants.tenSecondWaitTime);
    this.click(`//td[contains(text(), '${payerName}')]/parent::*/td[last()]//input`);
    this.click(action);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.dontSee('payerName');
    // this.see('Check and submit');
  },
  /**
   * Selects the first item from the payment list and clicks to see the details
   * @private
   */
  navigateValidateScreenAndClickAddFeeDetails() {
    this.click('#paymentInstruction0');
    this.waitForText('Validate payment', BARATConstants.twelveSecondWaitTime);
    this.see('Validate payment');
    // pause();
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
    this.click('Submit');
    this.dontSee('Please allocate all amount before processing');
    this.waitForText('Payments list', BARATConstants.twelveSecondWaitTime);
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
  },

  addNewUser() {
    const username = `${AddUserName + this.getDateInDDMMYYYY() + this.getTimeInHHMMSS()}@ABC.COM`;
    this.fillField('Email', username);
    this.click('Add user');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(username, BARATConstants.fiveSecondWaitTime);
  },

  disablePayhubFeature() {
    this.uncheckOption('#send-to-payhub');
    this.click('Save');
    this.wait(BARATConstants.fiveSecondWaitTime);
  },

  enablePayhubFeature() {
    this.checkOption('#send-to-payhub');
    this.click('Save');
    this.wait(BARATConstants.fiveSecondWaitTime);
  }

});
