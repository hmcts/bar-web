const BARATConstants = require('./BARAcceptanceTestConstants');

const {
  addAndRemoveFeeToPaymentInstruction,
  createCashPaymentInstruction
} = require('../pages/steps');
const faker = require('faker');

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

Scenario('Add Payment Type Postal Order', { retries: 2 }, I => {
  I.feeclerkPostalOrderPaymentType();
});

Scenario('Add Payment Type Cash', { retries: 2 }, I => {
  I.feeclerkCashPaymentType();
});

Scenario('Add Payment Type All Pay', { retries: 2 }, I => {
  I.feeclerkAllPayPaymentType();
});

Scenario('Add Payment Type Card', { retries: 2 }, I => {
  I.feeclerkCardPaymentType();
});

Scenario('Add Full Remission', { retries: 2 }, I => {
  I.feeclerkRemissionPaymentType();
});

Scenario('Add Full Remission and fees immediately', { retries: 2 }, I => {
  I.feeclerkRemissionPaymentTypeAddFeesPrompt();
});

Scenario('Want to revert to Pending Status.', { retries: 2 }, I => {
  I.feeClerkRevertPayment();
});

Scenario('Fee Clerk remove Fee', { retries: 2 }, I => {
  const payerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const paymentAmount = '550';
  const feeSearchDescription = '550';
  const caseNumber = 'IUB87YHQ';
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription });
});

Scenario('Want to change the fee and case number', { retries: 2 }, I => {
  I.feeclerkEditFee();
});

Scenario('Edit Payment Type Cheque', { retries: 2 }, I => {
  I.feeclerkEditChequePaymentType();
  I.Logout();
});
