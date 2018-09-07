const { fiveSecondWaitTime } = require('../tests/BARAcceptanceTestConstants');

function createCashPaymentInstruction({ I, payerName, paymentAmount }) {
  I.see('Add payment information');
  I.click('Add payment information');
  I.waitForElement('[type=radio]', fiveSecondWaitTime);
  I.see('Add Payment Instruction');
  I.click('#payment_type_CASH');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.click('Add payment');
}
function createChequePaymentInstruction({ I, chequeNumber, payerName, paymentAmount }) {
  I.see('Add payment information');
  I.click('Add payment information');
  I.waitForElement('[type=radio]', fiveSecondWaitTime);
  I.see('Add Payment Instruction');
  I.click('#payment_type_CHEQUE');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.fillField('#cheque-number', chequeNumber);
  I.click('Add payment');
}

function updatePaymentInstructionToValidated({ I, caseNumber, feeSearchDescription }) {
  I.see('Payments list');
  I.click('Payments list');
  I.waitForElement('#paymentInstruction0', fiveSecondWaitTime);
  I.click('#paymentInstruction0');
  I.waitForElement({ css: '[button-name=add-fee-details]' }, fiveSecondWaitTime);
  I.click({ css: '[button-name=add-fee-details]' });
  I.fillField('#case-reference', caseNumber);
  I.fillField('#feeSearch', feeSearchDescription);
  I.waitForElement('#feeCodeSearch0', fiveSecondWaitTime);
  I.click('#feeCodeSearch0');
  I.click('#save');
  I.see(feeSearchDescription);
  I.waitForText(caseNumber, fiveSecondWaitTime);
  I.selectOption('Action:', 'Process');
  I.click('#submit-action-btn');
  I.wait(fiveSecondWaitTime);
}

function updatePaymentInstructionToPendingApproval({ I, payerName }) {
  I.see('Check and submit');
  I.click('Check and submit');
  I.waitForText(payerName);
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
