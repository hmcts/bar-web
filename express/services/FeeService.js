const config = require('config');
const request = require('client-request/promise');

const barUrl = config.get('bar.url');

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
}

module.exports = FeeService;
