const config = require('config');

const barUrl = config.get('bar.url');
const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';
const feeJurisdictionsUrl = config.has('fee.jurisdictionsUrl') ? config.get('fee.jurisdictionsUrl') : '';

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
    this.addEditFeeToCase = this.addEditFeeToCase.bind(this);
    this.searchForFee = this.searchForFee.bind(this);
    this.removeFeeFromPaymentInstruction = this.removeFeeFromPaymentInstruction.bind(this);
    this.getJurisdictions = this.getJurisdictions.bind(this);
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

  getJurisdictions(req) {
    const uri = (req.query.jurisdiction === '1') ? '/jurisdictions1' : '/jurisdictions2';
    return this.makeHttpRequest({ uri: `${feeJurisdictionsUrl + uri}`, method: 'GET' }, req);
  }

  removeFeeFromPaymentInstruction(caseFeeId, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/fees/${caseFeeId}`,
      method: 'DELETE'
    }, req);
  }
}

module.exports = FeeService;
