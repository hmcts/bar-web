const config = require('config');
const request = require('client-request/promise');

const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';
const fees = require('../../data/fees_search_results_response.json');

class FeeService {
  constructor() {
    this.request = request;
    this.getFees = this.getFees.bind(this);
  }

  // this would have to be amended later
  getFees() {
    const body = fees;
    return Promise.resolve({ body });

    // return this.request({
    //   uri: `${feeUrl}`,
    //   method: 'GET',
    //   json: true
    // });
  }

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

  searchForFee() {
    return request({
      uri: `${feeUrl}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeFeeFromPaymentInstruction(caseFeeId) {
    return request({
      uri: `${barUrl}/fees/${caseFeeId}`,
      method: 'DELETE'
    });
  }
}

module.exports = FeeService;
