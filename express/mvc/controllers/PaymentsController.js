// import the payment service
const PaymentService = require('../../services').PaymentService;

class PaymentsController {

	async GetIndex(req, res) {
    try {
      const paymentTypes = await PaymentService.getPaymentTypes();
      res.json({ data: paymentTypes.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
	}

	async PostIndex(req, res) {
		const data = req.body;
		const paymentType = req.params.type;

    try {
      const sendPaymentDetails = await PaymentService.sendPaymentDetails(data, paymentType)
      res.json({ data: sendPaymentDetails.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
	}

}

module.exports = PaymentsController;
