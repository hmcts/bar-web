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

  getCount(queryString) {
    nock(`${barUrl}`)
      .get(`/payment-instructions/count${queryString}`)
      .reply(httpStatusCodes.OK, 1);
  }

  getStats(userId, queryString) {
    const instructions = paymentInstructionData
      .paymentInstructionsList
      .map(paymentInstruction => {
        paymentInstruction.user_id = userId;
        return paymentInstruction;
      });

    nock(`${barUrl}`)
      .get(`/users/${userId}/payment-instructions/stats`)
      .query(queryString)
      .reply(httpStatusCodes.OK, instructions);
  }

  rejectPaymentInstruction(paymentInstructionId) {
    if (paymentInstructionId === 1) {
      nock(`${barUrl}`)
        .patch(`/payment-instructions/${paymentInstructionId}/reject`)
        .reply(httpStatusCodes.OK, {});
    } else {
      nock(`${barUrl}`)
        .patch(`/payment-instructions/${paymentInstructionId}/reject`)
        .reply(httpStatusCodes.NOT_FOUND, { message: 'payment instruction for id=2 was not found' });
    }
  }

  sendToPayhub(timestamp) {
    if (timestamp === '1537285689806') {
      nock(`${barUrl}`)
        .get(`/payment-instructions/send-to-payhub/${timestamp}`)
        .query({})
        .reply(httpStatusCodes.OK, { total: 3, success: 3 });
    } else {
      nock(`${barUrl}`)
        .get(`/payment-instructions/send-to-payhub/${timestamp}`)
        .query({})
        .reply(httpStatusCodes.BAD_REQUEST, { message: 'This function is temporarily unavailable.' });
    }
  }
}

module.exports = PaymentInstructionServiceMock;
