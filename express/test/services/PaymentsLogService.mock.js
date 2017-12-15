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
}

module.exports = PaymentsLogServiceMock;
