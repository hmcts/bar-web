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
  addEditFeeToCase(caseReferenceId, data, method = 'POST') {
    const feeId = data.case_fee_id ? `/${data.case_fee_id}` : '';
    return request({
      uri: `${barUrl}/payment-instructions/${caseReferenceId}/fees${feeId}`,
      method,
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
