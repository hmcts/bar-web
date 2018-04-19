// import the payment service
const paymentService = require('../../services').paymentService;
const paymentInstructionService = require('../../services').paymentsLogService;
const utilService = require('../../services').utilService;

class PaymentsController {
  constructor() {
    // declare the services first
    this.paymentInstructionService = paymentInstructionService;

    this.indexAction = this.indexAction.bind(this);
  }

  // responsible for retrieving the payment instructions
  indexAction(req, res) {
    const success = false;
    const data = [];
    const { id } = req.params;

    return this.paymentInstructionService
      .searchPaymentsLog(req.query, req)
      .then(response => res.json({ data, id, response, success }))
      .catch(err => res.json({ id, success, err }));
  }

  async getIndex(req, res) {
    try {
      const paymentTypes = await paymentService.getPaymentTypes(req);
      res.json({ data: paymentTypes.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async postIndex(req, res) {
    const data = req.body;
    const paymentType = req.params.type;

    try {
      const sendPaymentDetails = await paymentService.sendPaymentDetails(data, paymentType, req);
      res.json({ data: sendPaymentDetails.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async getUnallocated(req, res) {
    const [error, amount] = await utilService
      .asyncTo(paymentService.getUnallocatedAmount(req.params.id, req));

    if (error) {
      return res.json({ data: {}, message: error.message, success: false });
    }
    return res.json({ data: amount.body, success: true });
  }
}

module.exports = PaymentsController;
