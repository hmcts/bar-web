const config = require('config'),
  nock = require('nock'),
  barUrl = config.get('bar.url'),
  httpStatusCodes = require('http-status-codes'),
  paymentInstructionData = require('../data/PaymentInstruction');

class PaymentInstructionServiceMock {
  getByIdamId(userId) {
    const instructions = paymentInstructionData
      .paymentInstructionsList
      .map(paymentInstruction => {
        paymentInstruction.user_id = userId;
        return paymentInstruction;
      });

    nock(`${barUrl}`)
      .get(`/users/${userId}/payment-instructions`)
      .query({})
      .reply(httpStatusCodes.OK, instructions);
  }
}

module.exports = PaymentInstructionServiceMock;
