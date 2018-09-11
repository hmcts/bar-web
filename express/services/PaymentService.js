const config = require('config');

const barUrl = config.get('bar.url');
const { isUndefined } = require('lodash');

/**
 * Responsible for providing all information
 * regarding payments
 */
class PaymentService {
  /**
   * Constructor
   * @param {Function(Object, XMLHttpRequest)} makeHttpRequest
   */
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getPaymentTypes = this.getPaymentTypes.bind(this);
    this.getUnallocatedAmount = this.getUnallocatedAmount.bind(this);
    this.sendPaymentDetails = this.sendPaymentDetails.bind(this);
  }
  /**
   * Get payment types
   * @param {XMLHttpRequest} req
   */
  getPaymentTypes(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/payment-types`,
      method: 'GET'
    }, req);
  }

  getUnallocatedAmount(id, req) {
    return this.makeHttpRequest({
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
    if (!isUndefined(body.id)) {
      uri = `${uri}/${body.id}`;
      method = 'PUT';
    }

    return this.makeHttpRequest({
      uri,
      method,
      body
    }, req);
  }
}

module.exports = PaymentService;
