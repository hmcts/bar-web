// import the payment log service
const { paymentsLogService, utilService } = require('../../services');
const HttpStatusCodes = require('http-status-codes');

/**
 * Responsible for handling anything to
 * do with PaymentLogs
 */
class PaymentsLogController {
  async getIndex(req, res) {
    let responseFormat = 'json';
    try {
      let status = '';
      if (req.query.hasOwnProperty('status')) {
        status = req.query.status;
      }

      if (req.query.hasOwnProperty('format')) {
        responseFormat = req.query.format;
      }

      const response = await paymentsLogService.getPaymentsLog(status, req, responseFormat);
      if (response.response.headers.hasOwnProperty('content-type') && response.response.headers['content-type'] === 'text/csv') {
        return res
          .set('Content-Type', 'application/octet-stream')
          .attachment('report.csv')
          .status(HttpStatusCodes.OK)
          .send(response.body);
      }

      return res.json({ data: response.body, success: true });
    } catch (exception) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        error: exception.message,
        success: false
      });
    }
  }

  async searchIndex(req, res) {
    const [err, data] = await utilService.asyncTo(
      paymentsLogService.searchPaymentsLog(req.query, req)
    );
    if (!err) {
      return res.json({ data: data.body, success: true });
    }

    return res.json({ data: {}, error: err.body, success: false });
  }

  async getById(req, res) {
    try {
      const paymentData = await paymentsLogService.getPaymentById(req.params.id, req);
      res.json({ data: paymentData.body, success: true });
    } catch (exception) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: exception.message,
        success: false
      });
    }
  }

  async postIndex(req, res) {
    try {
      const sendPendingPayments = await paymentsLogService.sendPendingPayments(req.body, req);
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
      .asyncTo(paymentsLogService.alterPaymentInstructionStatus(req.params.id, req.body, req));

    if (!err) {
      return res.json({ success: true });
    }

    return res.json({ success: false, err });
  }

  async deleteIndex(req, res) {
    const [err] = await utilService
      .asyncTo(paymentsLogService.deletePaymentById(req.params.id, req));

    if (!err) {
      return res.json({ success: true });
    }

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      data: {},
      message: err,
      success: false
    });
  }

  async postCases(req, res) {
    const [err, data] = await utilService
      .asyncTo(paymentsLogService.createCaseNumber(req.params.id, req.body, req));

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
