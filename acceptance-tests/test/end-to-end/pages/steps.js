const { fiveSecondWaitTime } = require('../tests/BARAcceptanceTestConstants');

function createCashPaymentInstruction({ I, payerName, paymentAmount }) {
  I.see('Add payment information');
  I.click('Add payment information');
  I.waitForElement('[type=radio]', fiveSecondWaitTime);
  I.see('Add Payment Instruction');
  I.click('#payment_type_cash');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.click('Add payment');
}
function createChequePaymentInstruction({ I, chequeNumber, payerName, paymentAmount }) {
  I.see('Add payment information');
  I.click('Add payment information');
  I.waitForElement('[type=radio]', fiveSecondWaitTime);
  I.see('Add Payment Instruction');
  I.click('#payment_type_cheques');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.fillField('#cheque-number', chequeNumber);
  I.click('Add payment');
}

function updatePaymentInstructionToValidated({ I, caseNumber, feeSearchDescription }) {
  I.see('Payments list');
  I.click('Payments list');
  I.seeElement('#paymentInstruction0');
  I.click('#paymentInstruction0');
  I.waitForElement({ css: '[button-name=add-fee-details]' }, fiveSecondWaitTime);
  I.click({ css: '[button-name=add-fee-details]' });
  I.fillField('#case-reference', caseNumber);
  I.fillField('#feeSearch', feeSearchDescription);
  I.waitForElement('#feeCodeSearch0', fiveSecondWaitTime);
  I.click('#feeCodeSearch0');
  I.click('#save');
  I.see(feeSearchDescription);
  I.see(caseNumber);
  I.selectOption('Action:', 'Process');
  I.click('#submit-action-btn');
}

function updatePaymentInstructionToPendingApproval({ I, payerName }) {
  I.see('Check and submit');
  I.click('Check and submit');
  I.see(payerName);
  I.seeElement('#paymentInstructionModel0');
  I.click('#paymentInstructionModel0');
  I.click('#payment-instruction-all');
  I.seeElement('#submit-button');
  I.click('#submit-button');
  I.dontSee(payerName);
}

module.exports = {
  createCashPaymentInstruction,
  createChequePaymentInstruction,
  updatePaymentInstructionToPendingApproval,
  updatePaymentInstructionToValidated
};
