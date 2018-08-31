const faker = require('faker');
const BARATConstants = require('./BARAcceptanceTestConstants');

const { createCashPaymentInstruction } = require('../pages/steps');

Feature('BAR Fee Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});

Scenario('Validate Add Payment Instruction Page', I => {
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.checkAddPaymentInstructionPage();
});

Scenario('Add Payment Type Postal Order', I => {
  I.feeclerkPostalOrderPaymentType();
});

Scenario('Add Payment Type Cash', I => {
  I.feeclerkCashPaymentType();
});

Scenario('Add Payment Type All Pay', I => {
  I.feeclerkAllPayPaymentType();
});

Scenario('Add Payment Type Card', I => {
  I.feeclerkCardPaymentType();
});

Scenario('Want to revert to Pending Status.', I => {
  I.feeClerkRevertPayment();
});

Scenario('Edit Payment Type Cheque', I => {
  I.feeclerkEditChequePaymentType();
  I.Logout();
});

Scenario('Edit a Payment Instruction as a Fee Clerk', I => {
  const caseNumber = '4XYZT0';
  I.amOnPage('/');
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  createCashPaymentInstruction({ I, payerName: faker.name.firstName(), paymentAmount: '200.00' });
  I.see('Payments list');
  I.click('Payments list');
  I.seeElement('#paymentInstruction0');
  I.click('#paymentInstruction0');
  I.waitForElement({ css: '[button-name=add-fee-details]' }, BARATConstants.fiveSecondWaitTime);
  I.click({ css: '[button-name=add-fee-details]' });
  I.fillField('#case-reference', caseNumber);
  I.fillField('#feeSearch', 'Where the party filing the request is legally aided');
  I.waitForElement('#feeCodeSearch0', BARATConstants.fiveSecondWaitTime);
  I.click('#feeCodeSearch0');
  I.click('#save');
  I.see('Where the party filing the request is legally aided');
  I.see(caseNumber);
});
