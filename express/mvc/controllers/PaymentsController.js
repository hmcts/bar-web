const { paymentService, paymentInstructionService } = require('../../services');

class PaymentsController {
  constructor({ response }) {
    // declare the services first
    this.paymentInstructionService = paymentInstructionService;
    this.paymentService = paymentService;
    this.response = response;

    this.indexAction = this.indexAction.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.postIndex = this.postIndex.bind(this);
    this.getUnallocated = this.getUnallocated.bind(this);
  }

  indexAction(req, res) {
    const data = [];
    const { id } = req.params;

    return this.paymentInstructionService
      .searchPaymentsLog(req.query, req)
      .then(resp => this.response(res, { data, id, resp }))
      .catch(err => this.response(res, { id, err }));
  }

  getIndex(req, res) {
    return this.paymentService
      .getPaymentTypes(req)
      .then(paymentTypes => this.response(res, paymentTypes.body))
      .catch(exception => this.response(res, {
        data: {},
        message: exception.message
      }, exception.response.statusCode));
  }

  postIndex(req, res) {
    const { type } = req.params;
    return this.paymentService
      .sendPaymentDetails(req.body, type, req)
      .then(sendPaymentDetails => this.response(res, sendPaymentDetails.body))
      .catch(exception => this.response(res, {
        data: {},
        message: exception.message
      }, exception.response.statusCode));
  }

  getUnallocated(req, res) {
    return this.paymentService
      .getUnallocatedAmount(req.params.id, req)
      .then(amount => this.response(res, amount.body))
      .catch(paymentTypes => this.response(res, paymentTypes.body));
  }
}

module.exports = PaymentsController;
