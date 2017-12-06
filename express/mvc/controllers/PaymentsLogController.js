// import the payment log service
const Services = require('../../services');

class PaymentsLogController {

  async GetIndex(req, res) {
    try {
      const response = await Services.PaymentsLogService.getPaymentsLog();
      res.json({ data: response.body, success: true })
    } catch (exception) {
      res.json({ data: {}, error: exception.message, success: false });
    }
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

  async PostIndex(req, res) {
    try {
      const sendPendingPayments = await Services.PaymentsLogService.sendPendingPayments(req.body);
      res.json({ data: sendPendingPayments.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
}

module.exports = PaymentsLogController;
