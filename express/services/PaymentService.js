const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class PaymentService {

  getPaymentTypes() {
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
    delete data.payment_type;

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
