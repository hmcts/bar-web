const config = require('config'),
  nock = require('nock'),
  barUrl = config.get('bar.url'),
  httpStatusCodes = require('http-status-codes'),
  paymentInstructionData = require('../data/PaymentInstruction');

class PaymentInstructionServiceMock {
  getByIdamId(userId) {
    const reqheaders = {};

    const instructions = paymentInstructionData
      .paymentInstructionsList
      .map(paymentInstruction => {
        paymentInstruction.user_id = userId;
        return paymentInstruction;
      });

    nock(`${barUrl}`, { reqheaders })
      .get(`/users/${userId}/payment-instructions`)
      .query({ status: 'P' })
      .reply(httpStatusCodes.OK, instructions);
  }
}

module.exports = PaymentInstructionServiceMock;
