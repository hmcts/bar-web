const BaseController = require('./BaseController');
const HttpStatusCodes = require('http-status-codes');
const { paymentInstructionService } = require('./../../services');

class PaymentInstructionController extends BaseController {
  constructor() {
    super();
    this.indexAction = this.indexAction.bind(this);
    this.paymentInstructionService = paymentInstructionService;
  }

  indexAction(req, res) {
    const { id } = req.params;

    return this.paymentInstructionService
      .getByIdamId(id, req.query, req)
      .then(paymentInstructions => this.response(res, paymentInstructions.body))
      .catch(err => this.response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }
}

module.exports = PaymentInstructionController;
