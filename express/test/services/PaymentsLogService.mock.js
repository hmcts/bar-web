const config = require('config'),
  nock = require('nock'),
  barUrl = config.get('bar.url'),
  httpStatusCodes = require('http-status-codes');

class PaymentsLogServiceMock {
  getPaymentsLog() {
    nock(`${barUrl}`)
      .get('/payment-instructions?status=D')
      .reply(httpStatusCodes.OK, [
        {
          payer_name: 'Derek Tchalakov',
          amount: 19999,
          currency: 'GBP',
          id: 88,
          status: 'Draft',
          payment_date: '2017-12-07T10:28:02.167',
          site_id: 'BR01',
          daily_sequence_id: 2,
          payment_type: {
            id: 'cash',
            name: 'Cash'
          }
        }
      ]);
  }

  getPaymentById(paymentID) {
    nock(`${barUrl}`)
      .get(`/payment-instructions/${paymentID}`)
      .reply(httpStatusCodes.OK, {
        payer_name: 'Derek Tchalakov',
        amount: 19999,
        currency: 'GBP',
        id: paymentID,
        status: 'Draft',
        payment_date: '2017-12-07T10:28:02.167',
        site_id: 'BR01',
        daily_sequence_id: 2,
        payment_type: {
          id: 'cash',
          name: 'Cash'
        }
      });
  }

  sendPendingPayments(data) {
    // create a cloned version of data, and return
    const newData = Object.assign({}, data);
    newData.id = 1;

    nock(`${barUrl}`)
      .patch('/payment-instructions')
      .reply(httpStatusCodes.NO_CONTENT, newData);
  }

  deletePaymentById(paymentID) {
    nock(`${barUrl}`)
      .delete(`/payment-instructions/${paymentID}`)
      .reply(httpStatusCodes.NO_CONTENT, {});
  }

  createCaseNumber(paymentID, caseReferenceData) {
    nock(`${barUrl}`)
      .post(`/payment-instructions/${paymentID}/cases`)
      .reply(httpStatusCodes.CREATED, {
        payer_name: 'tester',
        amount: 2000,
        currency: 'GBP',
        id: 2,
        status: 'D',
        payment_date: '2017-12-22T15:39:24.693',
        site_id: 'BR01',
        daily_sequence_id: 1,
        all_pay_transaction_id: null,
        cheque_number: null,
        postal_order_number: null,
        payment_type: {
          id: 'cash',
          name: 'Cash'
        },
        case_references: [
          {
            id: 18,
            case_reference: caseReferenceData.case_reference
          }
        ]
      });
  }
}

module.exports = PaymentsLogServiceMock;
