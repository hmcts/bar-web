class PaymentActionController {
  constructor({ response, paymentActionService }) {
    this.response = response;
    this.indexAction = this.indexAction.bind(this);
    this.paymentActionService = paymentActionService;
  }
  indexAction(req, res) {
    return this.paymentActionService.getPaymentActions(req)
      .then(data => this.response(res, data.body))
      .catch(err => response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }
}

module.exports = PaymentActionController;
