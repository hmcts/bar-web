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

  getUnallocatedAmount(id) {
    return request({
      uri: `${barUrl}/payment-instructions/${id}/unallocated`,
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
  sendPaymentDetails(body, type) {
    let method = 'POST';
    let url = `${barUrl}/${type}`;

    delete body.payment_type;
    if (typeof body.id !== 'undefined') {
      url = `${url}/${body.id}`;
      method = 'PUT';
    }

    return request({
      uri: url,
      method,
      body,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

module.exports = PaymentService;
