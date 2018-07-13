const config = require('config');

const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';
const fees = require('../../data/fees_search_results_response.json');

/**
 *
 *
 * @class FeeService
 */
class FeeService {
  /**
   * Creates an instance of FeeService.
   * @param {*} makeHttpRequest
   * @memberof FeeService
   */
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getFees = this.getFees.bind(this);
    this.addEditFeeToCase = this.addEditFeeToCase.bind(this);
    this.searchForFee = this.searchForFee.bind(this);
    this.removeFeeFromPaymentInstruction = this.removeFeeFromPaymentInstruction.bind(this);
  }

  /**
   * this would have to be amended later
   *
   * @returns
   * @memberof FeeService
   */
  getFees() {
    const body = fees;
    return Promise.resolve({ body });
  }

  /**
   * Responsible for adding fee to a particular case
   *
   * @param {*} caseReferenceId
   * @param {*} data
   * @param {*} req
   * @param {string} [method='POST']
   * @returns
   * @memberof FeeService
   */
  addEditFeeToCase(caseReferenceId, data, req, method = 'POST') {
    const feeId = data.case_fee_id ? `/${data.case_fee_id}` : '';

    return this.makeHttpRequest({
      uri: `${barUrl}/fees${feeId}`,
      body: data,
      method
    }, req);
  }

  searchForFee(req) {
    let uri = '/fees';
    const defaultFeeCriteria = 'isDraft=false&isActive=true&isExpired=false';

    if (req.query.hasOwnProperty('query')) {
      uri = `${uri}?${defaultFeeCriteria}&${(isNaN(req.query.query) ? `description=${req.query.query}` : `feeVersionAmount=${req.query.query}`)}`;
    }

    return this.makeHttpRequest({ uri: `${feeUrl + uri}`, method: 'GET' }, req);
  }

  removeFeeFromPaymentInstruction(caseFeeId, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/fees/${caseFeeId}`,
      method: 'DELETE'
    }, req);
  }
}

module.exports = FeeService;
