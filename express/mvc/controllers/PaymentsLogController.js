// import the payment log service
const Services = require('../../services');

class PaymentsLogController {

  GetIndex(req, res) {
  	Services.PaymentsLogService.getPaymentsLog()
      .then(response => res.json({ data: response.body, success: true }))
      .catch(error => res.json({ data: {}, error: error.message, success: false }));
  }

  async GetById(req, res) {
  	try {
  		const paymentData = await Services.PaymentService.getPaymentById(req.params.id);
      paymentData.body.amount = (paymentData.body.amount / 100);
  		res.json({ data: paymentData.body, success: true });
  	} catch (exception) {
  		res.json({ data: {}, message: exception.message, success: false });
  	}
  }

}

module.exports = PaymentsLogController;
