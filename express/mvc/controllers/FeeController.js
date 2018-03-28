const config = require('config');
const { feeService, utilService } = require('../../services');
const httpStatusCodes = require('http-status-codes');
const queryString = require('querystring');

class FeeController {
  constructor() {
    this.feeService = feeService;

    this.postAddFeeToCase = this.postAddFeeToCase.bind(this);
    this.putModifyFeeToCase = this.putModifyFeeToCase.bind(this);
    this.patchRemoveFeeFromCase = this.patchRemoveFeeFromCase.bind(this);

    this.indexAction = this.indexAction.bind(this);
  }

  indexAction(req, res) {
    this.feeService.getFees()
      .then(result => res.json({ fees: result.body, success: true }))
      .catch(err => res.json({ err, success: false }));
  }

  async getIndex(req, res) {
    if (!config.has('fee.url')) {
      return res.redirect(`/api/fees/search?${queryString.stringify(req.query)}`);
    }

    const [err, data] = await utilService.asyncTo(feeService.searchForFee(req.query));
    if (!err) {
      return res.json(data.body);
    }

    return res.json({ data: req.body, id: req.param.id });
  }

  async postAddFeeToCase(req, res) {
    const [err, data] = await utilService.asyncTo(
      feeService.addEditFeeToCase(req.params.id, req.body)
    );
    this.handleResponse(req, res, err, data);
  }

  async putModifyFeeToCase(req, res) {
    const [err, data] = await utilService.asyncTo(
      feeService.addEditFeeToCase(req.params.id, req.body, 'PUT')
    );
    this.handleResponse(req, res, err, data);
  }

  handleResponse(req, res, err, data) {
    if (!err) {
      return res.json({ data: data.body, id: req.params.id });
    }

    return res.json({ data: req.body, id: req.param.id });
  }

  getFees(req, res) {
    if (!req.query.hasOwnProperty('code')) {

      return res.json({ found: true });
    }

    const selectedFees = fees.filter(fee => {
      let status = false;

      if (fee.code.includes(req.query.code) || fee.code.includes(req.query.code.toUpperCase())) {
        status = true;
      } else if (typeof fee.current_version !== 'undefined' && Object.keys(fee.current_version).length > 0 && (fee.current_version.description.includes(req.query.code) || fee.current_version.description.toLowerCase().includes(req.query.code))) {
        status = true;
      }

      return status;
    });

    // if the code has been found
    return res.json({ found: true, fees: selectedFees });
  }

  patchRemoveFeeFromCase(req, res) {
    this.feeService.removeFeeFromPaymentInstruction(req.params.case_fee_id)
      .then(() => res.json({ message: 'Successfully removed Case Fee Id', success: true }))
      .catch(err => res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
      );
  }
}

module.exports = FeeController;
