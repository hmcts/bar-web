const config = require( 'config' );
const request = require( 'client-request/promise' );
const barUrl = config.get( 'bar.url' );

/**
 * Responsible for providing all information
 * regarding paymentlogs
 */
class PaymentsLogService {

  /**
   * Gets payment log from API
   */
  getPaymentsLog () {
    return request({
      uri: `${barUrl}/payment-instructions?status=D`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Sends pending payments to API
   */
  sendPendingPayments ( data ) {
    return request({
      uri: `${barUrl}/payment-instructions`,
      method: "PATCH",
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  /**
   * Get payment by paymentID (not sequence_id)
   * @param paymentID 
   */
  getPaymentById ( paymentID ) {
    return request({
      uri: `${barUrl}/payment-instruction/${paymentID}`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Delete payment by paymentID (not sequence_id)
   * @param paymentID 
   */
  deletePaymentById ( paymentID ) {
    return request({
      uri: `${barUrl}/payment-instruction/${paymentID}`,
      method: "DELETE",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

module.exports = PaymentsLogService;
