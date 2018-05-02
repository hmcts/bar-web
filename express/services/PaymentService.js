const config = require('config');
const BaseService = require('./BaseService');

const barUrl = config.get('bar.url');

/**
 * Responsible for providing all information
 * regarding payments
 */
class PaymentService extends BaseService {
  /**
   * Get payment types
   */
  getPaymentTypes(req) {
    return this.request({
      uri: `${barUrl}/payment-types`,
      method: 'GET'
    }, req);
  }

  getUnallocatedAmount(id, req) {
    return this.request({
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
    let uri = `${barUrl}/${type}`;

    delete body.payment_type;
    if (typeof body.id !== 'undefined') {
      uri = `${uri}/${body.id}`;
      method = 'PUT';
    }

    return this.request({
      uri,
      method,
      body
    }, req);
  }
}

module.exports = PaymentService;
