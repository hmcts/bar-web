const config = require('config');
const request = require('client-request/promise');
const BaseService = require('./BaseService');

const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';
const fees = require('../../data/fees_search_results_response.json');

class FeeService extends BaseService {
  constructor() {
    super();
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

  /**
   * Responsible for adding fee to a particular case
   * @param {*} caseReferenceId
   * @param {*} data
   * @param {*} req - original request from the browser
   */
  addEditFeeToCase(caseReferenceId, data, req, method = 'POST') {
    const feeId = data.case_fee_id ? `/${data.case_fee_id}` : '';
    return this.request({
      uri: `${barUrl}/payment-instructions/${caseReferenceId}/fees${feeId}`,
      method,
      body: data
    }, req);
  }

  searchForFee(req) {
    return this.request({
      uri: `${feeUrl}`,
      method: 'GET'
    });
  }

  removeFeeFromPaymentInstruction(caseFeeId,) {
    return this.request({
      uri: `${barUrl}/fees/${caseFeeId}`,
      method: 'DELETE'
    }, req);
  }
}

module.exports = FeeService;
