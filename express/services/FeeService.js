const config = require('config');
const request = require('client-request/promise');
const queryString = require('querystring');

const barUrl = config.get('bar.url');
const feeUrl = config.get('fee.url');

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
    const qs = queryString.stringify(query);

    return request({
      uri: `${feeUrl}/fees?${qs}`,
      method: 'GET',
      query,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

module.exports = FeeService;
