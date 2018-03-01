// import the payment log service
const { paymentsLogService, utilService } = require('../../services');
const HttpStatusCodes = require('http-status-codes');

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
    try {
      let status = '';
      if (req.query.hasOwnProperty('status')) {
        status = req.query.status;
      }

      const response = await paymentsLogService.getPaymentsLog(status);
      res.json({ data: response.body, success: true });
    } catch (exception) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        error: exception.message,
        success: false
      });
    }
  }

  /**
   * Search payment logs
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async searchIndex(req, res) {
    const [err, data] = await utilService.asyncTo(paymentsLogService.searchPaymentsLog(req.query));
    if (!err) {
      return res.json({ data: data.body, success: true });
    }

    return res.json({ data: {}, error: err.body, success: false });
  }

  /**
   * Get payment log by ID
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async getById(req, res) {
    try {
      const paymentData = await paymentsLogService.getPaymentById(req.params.id);
      res.json({ data: paymentData.body, success: true });
    } catch (exception) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: exception.message,
        success: false
      });
    }
  }

  /**
   * Post pending payments
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async postIndex(req, res) {
    try {
      const sendPendingPayments = await paymentsLogService.sendPendingPayments(req.body);
      res.json({ data: sendPendingPayments.body, success: true });
    } catch (exception) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: exception.message,
        success: false
      });
    }
  }

  async patchIndex(req, res) {
    const [err] = await utilService
      .asyncTo(paymentsLogService.alterPaymentInstructionStatus(req.params.id, req.body));

    if (!err) {
      return res.json({ success: true });
    }

    return res.json({ success: false, err });
  }

  /**
   * Deletes a payment by paymentID
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async deleteIndex(req, res) {
    const [err] = await utilService
      .asyncTo(paymentsLogService.deletePaymentById(req.params.id));

    if (!err) {
      return res.json({ success: true });
    }

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      data: {},
      message: err,
      success: false
    });
  }

  /**
   * Responsible for adding a case reference ID
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async postCases(req, res) {
    const [err, data] = await utilService
      .asyncTo(paymentsLogService.createCaseNumber(req.params.id, req.body));

    if (!err) {
      return res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: data.body
      });
    }

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      data: {},
      message: err.body,
      success: false
    });
  }
}

module.exports = PaymentsLogController;
