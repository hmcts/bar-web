const config = require('config');
const request = require('client-request/promise');

const barUrl = config.get('bar.url');

/**
 * Responsible for providing all information
 * regarding payments
 */
class PaymentService {
  /**
   * Get payment types
   */
  getPaymentTypes() {
    return request({
      uri: `${barUrl}/payment-types`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * sends payment details to API
   * @param data
   * @param type
   */
  sendPaymentDetails(data, type) {
    let method = 'POST';
    let url = `${barUrl}/${type}`;
    const multiplyVariable = 100;

    delete data.payment_type;
    if (typeof data.id !== 'undefined') {
      url = `${url}/${data.id}`;
      method = 'PUT';
    }

    data.amount = (data.amount * multiplyVariable);

    return request({
      uri: url,
      method,
      body: data,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

module.exports = PaymentService;
