// import the payment log service
const Services = require('../../services');

/**
 * Responsible for handling anything to
 * do with PaymentLogs
 */
class PaymentsLogController {
  /**
   * Get all payment logs
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async getIndex(req, res) {
    // draft by default
    let status = 'D';

    // @todo use validator
    if (typeof req.query.status !== 'undefined' && req.query.status === 'P') status = 'P';

    try {
      const response = await Services.paymentsLogService.getPaymentsLog(status);
      res.json({ data: response.body, success: true });
    } catch (exception) {
      res.json({ data: {}, error: exception.message, success: false });
    }
  }

  /**
   * Get payment log by ID
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async getById(req, res) {
    try {
      const paymentData = await Services.paymentsLogService.getPaymentById(req.params.id);
      paymentData.body.amount = (paymentData.body.amount / 100); // eslint-disable-line no-magic-numbers
      res.json({ data: paymentData.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  /**
   * Post pending payments
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async postIndex(req, res) {
    try {
      const sendPendingPayments = await Services.paymentsLogService.sendPendingPayments(req.body);
      res.json({ data: sendPendingPayments.body, success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }

  /**
   * Deletes a payment by paymentID
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async deleteIndex(req, res) {
    try {
      await Services.paymentsLogService.deletePaymentById(req.params.id);
      res.json({ success: true });
    } catch (exception) {
      res.json({ data: {}, message: exception.message, success: false });
    }
  }
}

module.exports = PaymentsLogController;
