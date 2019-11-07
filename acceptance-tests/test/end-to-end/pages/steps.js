const { tenSecondWaitTime } = require('../tests/BARAcceptanceTestConstants');

function createCashPaymentInstruction({ I, payerName, paymentAmount }) {
  I.see('Add payment');
  I.click('Add payment');
  I.waitForElement('[type=radio]', tenSecondWaitTime);
  I.see('Add payment');
  I.click('#payment_type_CASH');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.click('#instruction-submit');
}
function createChequePaymentInstruction({ I, chequeNumber, payerName, paymentAmount }) {
  I.see('Add payment');
  I.click('Add payment');
  I.waitForElement('[type=radio]', tenSecondWaitTime);
  I.see('Add payment');
  I.click('#payment_type_CHEQUE');
  I.fillField('#payer-name', payerName);
  I.fillField('#amount', paymentAmount);
  I.fillField('#cheque-number', chequeNumber);
  I.click('#instruction-submit');
}

function updatePaymentInstructionToValidated({ I, caseNumber, feeSearchDescription }) {
  I.see('Payments list');
  I.click('Payments list');
  I.waitForElement('#paymentInstruction0', tenSecondWaitTime);
  I.click('#paymentInstruction0');
  I.waitForElement({ css: '[button-name=add-fee-details]' }, tenSecondWaitTime);
  I.click({ css: '[button-name=add-fee-details]' });
  I.fillField('#case-reference', caseNumber);
  I.fillField('#feeSearch', feeSearchDescription);
  I.waitForElement('#feeCodeSearch0', tenSecondWaitTime);
  I.click('#feeCodeSearch0');
  I.click('#save');
  I.see(feeSearchDescription);
  I.waitForText(caseNumber, tenSecondWaitTime);
  I.selectOption('Action:', 'Process');
  I.click('#submit-action-btn');
  I.wait(tenSecondWaitTime);
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

function addAndRemoveFeeToPaymentInstruction({ I, caseNumber, feeSearchDescription }) {
  I.see('Payments list');
  I.click('Payments list');
  I.waitForElement('#paymentInstruction0', tenSecondWaitTime);
  I.click('#paymentInstruction0');
  I.waitForElement({ css: '[button-name=add-fee-details]' }, tenSecondWaitTime);
  I.click({ css: '[button-name=add-fee-details]' });
  I.fillField('#case-reference', caseNumber);
  I.fillField('#feeSearch', feeSearchDescription);
  I.waitForElement('#feeCodeSearch0', tenSecondWaitTime);
  I.click('#feeCodeSearch0');
  I.click('#save');
  I.see(feeSearchDescription);
  I.waitForText(caseNumber, tenSecondWaitTime);
  I.seeElement('#removeFee_0');
  I.click('#removeFee_0');
  I.wait(tenSecondWaitTime);
  I.dontSeeElement('#removeFee_0');
}

module.exports = {
  addAndRemoveFeeToPaymentInstruction,
  createCashPaymentInstruction,
  createChequePaymentInstruction,
  updatePaymentInstructionToPendingApproval,
  updatePaymentInstructionToValidated
};
