// import the payment service
const { paymentService, paymentInstructionService, utilService } = require('../../services');

const { response } = utilService;

class PaymentsController {
  constructor() {
    // declare the services first
    this.paymentInstructionService = paymentInstructionService;
    this.paymentService = paymentService;
    this.indexAction = this.indexAction.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.postIndex = this.postIndex.bind(this);
    this.getUnallocated = this.getUnallocated.bind(this);
  }

  // responsible for retrieving the payment instructions
  indexAction(req, res) {
    const success = false;
    const data = [];
    const { id } = req.params;

    return this.paymentInstructionService
      .searchPaymentsLog(req.query, req)
      .then(resp => response(res, { data, id, resp, success }))
      .catch(err => response(res, { id, success, err }));
  }

  async getIndex(req, res) {
    try {
      const paymentTypes = await this.paymentService.getPaymentTypes(req);
      res.json({ data: paymentTypes.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async postIndex(req, res) {
    const data = req.body;
    const paymentType = req.params.type;

    try {
      // eslint-disable-next-line
      const sendPaymentDetails = await this.paymentService.sendPaymentDetails(data, paymentType, req);
      res.json({ data: sendPaymentDetails.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async getUnallocated(req, res) {
    const [error, amount] = await utilService
      .asyncTo(this.paymentService.getUnallocatedAmount(req.params.id, req));

    if (error) {
      return res.json({ data: {}, message: error.message, success: false });
    }
    return res.json({ data: amount.body, success: true });
  }
}

module.exports = PaymentsController;
