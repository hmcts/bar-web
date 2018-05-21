const config = require('config');
const UtilService = require('./UtilService');

const { makeHttpRequest } = UtilService;
const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';
const fees = require('../../data/fees_search_results_response.json');

class FeeService {
  constructor() {
    this.getFees = this.getFees.bind(this);
  }

  // this would have to be amended later
  getFees() {
    const body = fees;
    return Promise.resolve({ body });
  }

  /**
   * Responsible for adding fee to a particular case
   * @param {*} caseReferenceId
   * @param {*} data
   * @param {*} req - original request from the browser
   */
  addEditFeeToCase(caseReferenceId, data, req, method = 'POST') {
    const feeId = data.case_fee_id ? `/${data.case_fee_id}` : '';

    return makeHttpRequest({
      uri: `${barUrl}/fees${feeId}`,
      method,
      body: data
    }, req);
  }

  searchForFee(req) {
    return makeHttpRequest({
      uri: `${feeUrl}`,
      method: 'GET'
    }, req);
  }

  removeFeeFromPaymentInstruction(caseFeeId, req) {
    return makeHttpRequest({
      uri: `${barUrl}/fees/${caseFeeId}`,
      method: 'DELETE'
    }, req);
  }
}

module.exports = FeeService;
