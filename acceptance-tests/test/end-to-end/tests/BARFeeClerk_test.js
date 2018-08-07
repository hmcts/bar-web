const faker = require('faker');
const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Fee Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
});

Scenario('Add Payment Instruction', I => {
  I.checkAddPaymentInstructionPage();
});

Scenario('Select Payment Type Cheque', I => {
  I.feeclerkChequePaymentType();
});

Scenario('Select Payment Type Postal Order', I => {
  I.feeclerkPostalOrderPaymentType();
});

Scenario('Select Payment Type Cash', I => {
  I.feeclerkCashPaymentType();
});

Scenario('Select Payment Type All Pay', I => {
  I.feeclerkAllPayPaymentType();
});

Scenario('Select Payment Type Card', I => {
  I.feeclerkCardPaymentType();
  I.Logout();
});

Scenario('Want to revert to Pending Status.', I => {
  I.feeClerkRevertPayment();
  I.Logout();
});
