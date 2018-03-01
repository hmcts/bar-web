// import the payment service
const PaymentService = require('../../services').paymentService;
const utilService = require('../../services').utilService;

/**
 * Responsible for handling anything to
 * do with Payments
 */
class PaymentsController {
  /**
   * Get all payment
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async getIndex(req, res) {
    try {
      const paymentTypes = await PaymentService.getPaymentTypes();
      res.json({ data: paymentTypes.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  /**
   * Send payment details (which eventually go to logs)
   * @param {express.Request} req
   * @param {express.Response} res
   */
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

  async getUnallocated(req, res){
    const [error, amount] = await utilService.asyncTo(PaymentService.getUnallocatedAmount(req.params.id));
    if (error){
      return res.json({ data: {}, message: error.message, success: false });
    }
    res.json({data: amount.body, success: true});
  }
}

module.exports = PaymentsController;
