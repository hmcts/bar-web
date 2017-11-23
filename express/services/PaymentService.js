const axios = require('axios');
const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class PaymentService {
  getPaymentTypes() {
    console.log( `Trying to reach: ${barUrl}/payment-types` );

    return request({
      uri: `${barUrl}/payment-types`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  sendPaymentDetails(data, type) {
    console.log( `Trying to reach: ${barUrl}/${type}` );

    // remove payment type
    delete data.payment_type;
    console.log( data );

    return request({
      uri: `${barUrl}/${type}`,
      method: "POST",
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

module.exports = PaymentService;
