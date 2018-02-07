const config = require('config');
const request = require('client-request/promise');
const queryString = require('querystring');

const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';

class FeeService {
  /**
   * Responsible for adding fee to a particular case
   * @param {*} caseReferenceId
   * @param {*} data
   */
  addFeeToCase(caseReferenceId, data) {
    return request({
      uri: `${barUrl}/payment-instructions/${caseReferenceId}/fees`,
      method: 'POST',
      body: data,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  searchForFee(query) {
    return request({
      uri: `${feeUrl}/fees/search?${queryString.stringify(query)}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

module.exports = FeeService;
