// import the payment service
const PaymentService = require('../../services').paymentService;
const utilService = require('../../services').utilService;

class PaymentsController {
  async getIndex(req, res) {
    try {
      const paymentTypes = await PaymentService.getPaymentTypes();
      res.json({ data: paymentTypes.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async postIndex(req, res) {
    const data = req.body;
    const paymentType = req.params.type;

    try {
      const sendPaymentDetails = await PaymentService.sendPaymentDetails(data, paymentType);
      res.json({ data: sendPaymentDetails.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  async getUnallocated(req, res) {
    const [error, amount] = await utilService
      .asyncTo(PaymentService.getUnallocatedAmount(req.params.id));

    if (error) {
      return res.json({ data: {}, message: error.message, success: false });
    }
    return res.json({ data: amount.body, success: true });
  }
}

module.exports = PaymentsController;
