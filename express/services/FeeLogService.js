const config = require( 'config' );
const request = require( 'client-request/promise' );
const barUrl = config.get( 'bar.url' );

/**
 * Provides information regarding fee logs
 */
class FeeLogService {

  /**
   * Gets the fee log from API
   */
  getFeeLog () {
    return request({
      uri: `${barUrl}/payment-instructions?status=P`,
      method: "GET",
      json: true,
      headers: {
          'Content-Type': 'application/json'
        }
    });
  }
}

module.exports = FeeLogService;
