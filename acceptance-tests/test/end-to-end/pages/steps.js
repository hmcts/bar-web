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

module.exports = { createCashPaymentInstruction };
