const faker = require('faker');
const BARATConstants = require('./BARAcceptanceTestConstants');

const {
  createCashPaymentInstruction,
  updatePaymentInstructionToValidated
} = require('../pages/steps');

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

Scenario.only('Edit a Payment Instruction as a Fee Clerk', I => {
  const caseNumber = '4XYZT0';
  const feeSearchDescription = 'Where the party filing the request is legally aided';
  const payerName = faker.name.firstName();
  const paymentAmount = '200.00';
  I.amOnPage('/');
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  updatePaymentInstructionToValidated({ I, caseNumber, feeSearchDescription });
});
