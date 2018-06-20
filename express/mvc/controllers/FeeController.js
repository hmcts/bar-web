const httpStatusCodes = require('http-status-codes');

class FeeController {
  constructor({ feeService, utilService }) {
    this.feeService = feeService;
    this.utilService = utilService;

    this.postAddFeeToCase = this.postAddFeeToCase.bind(this);
    this.putModifyFeeToCase = this.putModifyFeeToCase.bind(this);

    this.indexAction = this.indexAction.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
    this.searchForFee = this.searchForFee.bind(this);
  }

  indexAction(req, res) {
    return this.feeService
      .getFees()
      .then(result => res.json({ found: true, fees: result.body, success: true }))
      .catch(err => res.json({ err, success: false }));
  }

  deleteAction(req, res) {
    return this.feeService
      .removeFeeFromPaymentInstruction(req.params.case_fee_id, req)
      .then(() => res.json({ message: 'Successfully removed Case Fee Id', success: true }))
      .catch(err => res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message, success: false })
      );
  }

  searchForFee(req, res) {
    return this.feeService.searchForFee(req)
      .then(result => res.json({ found: true, fees: result.body, success: true }))
      .catch(err => {
        res.json({ err, success: false });
      });
  }

  async postAddFeeToCase(req, res) {
    const [err, data] = await this.utilService.asyncTo(
      this.feeService.addEditFeeToCase(req.params.id, req.body, req)
    );
    this.handleResponse(req, res, err, data);
  }

  async putModifyFeeToCase(req, res) {
    const [err, data] = await this.utilService.asyncTo(
      this.feeService.addEditFeeToCase(req.params.id, req.body, req, 'PUT')
    );
    this.handleResponse(req, res, err, data);
  }

  handleResponse(req, res, err, data) {
    if (!err) {
      return res.json({ data: data.body, id: req.params.id });
    }

    return res.json({ data: req.body, id: req.param.id });
  }
}

module.exports = FeeController;
