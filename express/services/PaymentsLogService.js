const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class PaymentsLogService {
  
  getPaymentsLog() {
    return request({
      uri: `${barUrl}/payment-instructions`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  sendPendingPayments(data) {
    return request({
      uri: `${barUrl}/payment-instructions`,
      method: "PATCH",
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}

module.exports = PaymentsLogService;
