const HttpStatusCodes = require('http-status-codes');
const { paymentInstructionService, utilService } = require('./../../services');

const { response } = utilService;

class PaymentInstructionController {
  constructor() {
    this.indexAction = this.indexAction.bind(this);
  }

  indexAction(req, res) {
    const { id } = req.params;

    return paymentInstructionService
      .getByIdamId(id, req.query, req)
      .then(paymentInstructions => response(res, paymentInstructions.body))
      .catch(err => response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }
}

module.exports = PaymentInstructionController;
