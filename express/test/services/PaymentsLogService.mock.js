const config = require('config'),
  nock = require('nock'),
  barUrl = config.get('bar.url'),
  httpStatusCodes = require('http-status-codes');

class PaymentsLogServiceMock {
  getPaymentsLog(status = 'D') {
    nock(`${barUrl}`)
      .get(`/payment-instructions?status=${status}`)
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
  searchPaymentsLogByDailySequenceId(dailySequenceId) {
    nock(`${barUrl}`)
      .get('/payment-instructions')
      .query({ status: 'P', allPayInstructionId: dailySequenceId, dailySequenceId, chequeNumber: dailySequenceId, postalOrderNumber: dailySequenceId })
      .reply(httpStatusCodes.OK, [
        {
          payer_name: 'PostalOrderPayer',
          amount: 400000,
          currency: 'GBP',
          postal_order_number: '345678',
          id: 13,
          status: 'Pending',
          payment_date: '2018-01-11T11:17:41.166',
          site_id: 'BR01',
          daily_sequence_id: 11111,
          payment_type: {
            id: 'postal-orders',
            name: 'Postal Order'
          },
          case_references: []
        }
      ]);
  }


  searchPaymentsLogByPostalOrderNumber(postalOrderNumber) {
    nock(`${barUrl}`)
      .get('/payment-instructions')
      .query({ status: 'P', allPayInstructionId: postalOrderNumber, dailySequenceId: '345678', chequeNumber: '345678', postalOrderNumber })
      .reply(httpStatusCodes.OK, [
        {
          payer_name: 'PostalOrderPayer',
          amount: 300000,
          currency: 'GBP',
          postal_order_number: '345678',
          id: 13,
          status: 'Pending',
          payment_date: '2018-01-11T11:17:41.166',
          site_id: 'BR01',
          daily_sequence_id: 3,
          payment_type: {
            id: 'postal-orders',
            name: 'Postal Order'
          },
          case_references: []
        }
      ]);
  }

  searchPaymentsLogByChequeNumber(chequeNumber) {
    nock(`${barUrl}`)
      .get('/payment-instructions')
      .query({ status: 'P', allPayInstructionId: chequeNumber, dailySequenceId: '123456', chequeNumber, postalOrderNumber: '123456' })
      .reply(httpStatusCodes.OK, [
        {
          payer_name: 'ChequePayer',
          amount: 200000,
          currency: 'GBP',
          cheque_number: '345678',
          id: 13,
          status: 'Pending',
          payment_date: '2018-01-11T11:17:41.166',
          site_id: 'BR01',
          daily_sequence_id: 3,
          payment_type: { id: 'cheques', name: 'Cheque' },
          case_references: []
        }
      ]);
  }

  alterPaymentInstructionStatus(paymentInstructionId, requestBody) {
    nock(`${barUrl}`)
      .patch(`/payment-instructions/${paymentInstructionId}`, requestBody)
      .reply(httpStatusCodes.NO_CONTENT, {});
  }
}

module.exports = PaymentsLogServiceMock;
