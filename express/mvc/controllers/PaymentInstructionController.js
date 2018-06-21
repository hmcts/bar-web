const HttpStatusCodes = require('http-status-codes');
const { utilService } = require('./../../services');

const { response } = utilService;

class PaymentInstructionController {
  constructor({ paymentInstructionService }) {
    this.indexAction = this.indexAction.bind(this);
    this.paymentInstructionService = paymentInstructionService;
  }

  indexAction(req, res) {
    const { id } = req.params;

    return this.paymentInstructionService
      .getByIdamId(id, req.query, req)
      .then(paymentInstructions => response(res, paymentInstructions.body))
      .catch(err => response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }
}

module.exports = PaymentInstructionController;
