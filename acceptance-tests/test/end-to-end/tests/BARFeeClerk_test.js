const BARATConstants = require('./BARAcceptanceTestConstants');

const {
  addAndRemoveFeeToPaymentInstruction,
  createCashPaymentInstruction
} = require('./../pages/steps');
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

Scenario('BAR-333: Fee Clerk remove Fee', I => {
  const payerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const paymentAmount = '200';
  const feeSearchDescription = '200';
  const caseNumber = 'IUB87YHQ';
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription });
});

Scenario('Edit Payment Type Cheque', I => {
  I.feeclerkEditChequePaymentType();
  I.Logout();
});
