const config = require('config');
const UtilService = require('./UtilService');

const { makeHttpRequest } = UtilService;
const barUrl = config.get('bar.url');

/**
 * Responsible for providing all information
 * regarding payments
 */
class PaymentService {
  /**
   * Get payment types
   */
  getPaymentTypes(req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-types`,
      method: 'GET'
    }, req);
  }

  getUnallocatedAmount(id, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${id}/unallocated`,
      method: 'GET'
    }, req);
  }

  /**
   * sends payment details to API
   * @param data
   * @param type
   */
  sendPaymentDetails(body, type, req) {
    let method = 'POST';
    let url = `${barUrl}/${type}`;

    delete body.payment_type;
    if (typeof body.id !== 'undefined') {
      url = `${url}/${body.id}`;
      method = 'PUT';
    }

    return makeHttpRequest({
      uri: url,
      method,
      body
    }, req);
  }
}

module.exports = PaymentService;
