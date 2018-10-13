const config = require('config');

const barUrl = config.get('bar.url');

class PaymentActionService {
  constructor({ httpRequest }) {
    this.httpRequest = httpRequest;
  }
  getPaymentActions(req) {
    return this.httpRequest({
      uri: `${barUrl}/payment-action`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }
}

module.exports = PaymentActionService;