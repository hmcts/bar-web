const axios = require('axios');
const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class PaymentsLogService {
  getPaymentsLog() {
    console.log( `Trying to reach: ${barUrl}/payment-instructions?status=D` );

    return request({
      uri: `${barUrl}/payment-instructions?status=D`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

module.exports = PaymentsLogService;
