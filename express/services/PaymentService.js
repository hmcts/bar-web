const config = require( 'config' );
const request = require( 'client-request/promise' );
const barUrl = config.get( 'bar.url' );

/**
 * Responsible for providing all information
 * regarding payments
 */
class PaymentService {

  /**
   * Get payment types
   */
  getPaymentTypes () {
    return request({
      uri: `${barUrl}/payment-types`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * sends payment details to API
   * @param data
   * @param type
   */
  sendPaymentDetails ( data, type ) {
    console.log ( data, typeof data  );
    let method = 'POST';
    let url = `${barUrl}/${type}`;

    delete data.payment_type;
    if ( typeof data.id !== 'undefined' ) {
      url = `${barUrl}/payment-instructions/${data.id}`;
      method = 'PATCH';
    }

    return request({
      uri: url,
      method: method,
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}

module.exports = PaymentService;
