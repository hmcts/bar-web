const BARATConstants = require('./BARAcceptanceTestConstants');
const testConfig = require('../config/BARConfig');

const paymentReferenceSite1 = '454545';
const paymentReferenceSite2 = '232323';
const {
  addAndRemoveFeeToPaymentInstruction,
  createCashPaymentInstruction
} = require('../pages/steps');
const faker = require('faker');

Feature('BAR Fee Clerk Add Payment Instruction').retry(BARATConstants.testRetry);

Scenario('@functional Run once to check multi site payments', ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  I.feeclerkPostalOrderPaymentTypeSite1();
  I.see(paymentReferenceSite1);
  I.Logout();
  I.login('site2feeclerk@mailinator.com', 'LevelAt12');
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  I.feeclerkCashPaymentTypeSite2();
  I.see(paymentReferenceSite2);
  I.dontSee(paymentReferenceSite1);
  I.Logout();
}).retry(testConfig.ScenarioRetryLimit);

/* Scenario('@functional Add / edit different payment types', async({ I }) => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.waitForText('Payments overview', BARATConstants.tenSecondWaitTime);
  const fullRemissionEnabled = await I.checkIfFullRemissionEnabled();
  I.Logout();

  I.login('barpreprodfeeclerk1@mailinator.com', 'LevelAt12');
  I.checkAddPaymentInstructionPage();

  I.feeclerkPostalOrderPaymentType();

  I.feeclerkCashPaymentType();

  I.feeclerkAllPayPaymentType();

  I.feeclerkCardPaymentType();

  if (fullRemissionEnabled) {
    I.feeclerkRemissionPaymentType();
  }

  if (fullRemissionEnabled) {
    I.feeclerkRemissionPaymentTypeAddFeesPrompt();
  }

  I.feeClerkRevertPayment();

  I.feeclerkCashPaymentTypeWithTwoFees();

  I.feeclerkEditFee();

  I.feeclerkEditChequePaymentType();

  I.Logout();
}).retry(testConfig.ScenarioRetryLimit); */

Scenario('@functional Fee Clerk remove Fee', { retries: 2 }, ({ I }) => {
  I.login(testConfig.TestBarFeeClerkUserName, testConfig.TestBarFeeClerkPassword);

  const payerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const paymentAmount = '593';
  const feeSearchDescription = '593';
  const caseNumber = 'IUB87YHQ';
  createCashPaymentInstruction({ I, payerName, paymentAmount });
  addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription });

  I.Logout();
}).retry(testConfig.ScenarioRetryLimit);
