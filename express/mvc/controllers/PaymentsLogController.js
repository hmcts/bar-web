const HttpStatusCodes = require('http-status-codes');
const { response } = require('./../../services/UtilService');

class PaymentsLogController {
  constructor({ paymentsLogService }) {
    this.paymentsLogService = paymentsLogService;
    this.getIndex = this.getIndex.bind(this);
    this.searchIndex = this.searchIndex.bind(this);
    this.getById = this.getById.bind(this);
    this.postIndex = this.postIndex.bind(this);
    this.putIndex = this.putIndex.bind(this);
    this.deleteIndex = this.deleteIndex.bind(this);
    this.postCases = this.postCases.bind(this);
  }

  getIndex(req, res) {
    const responseFormat = (req.query.hasOwnProperty('format')) ? req.query.format : '';
    const status = (req.query.hasOwnProperty('status')) ? req.query.status : '';

    this.paymentsLogService
      .getPaymentsLog(status, req, responseFormat)
      .then(resp => {
        if (resp.response.headers.hasOwnProperty('content-type') && resp.response.headers['content-type'] === 'text/csv') {
          return res
            .set('Content-Type', 'application/octet-stream')
            .attachment('report.csv')
            .status(HttpStatusCodes.OK)
            .send(response.body);
        }
        return res.json({ data: resp.body, success: true });
      })
      .catch(exception => res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        error: exception.message,
        success: false
      }));
  }

  searchIndex(req, res) {
    this.paymentsLogService
      .searchPaymentsLog(req.query, req)
      .then(data => res.json({ data: data.body, success: true }))
      .catch(err => res.json({ data: err, success: false }));
  }

  getById(req, res) {
    this.paymentsLogService
      .getPaymentById(req.params.id, req)
      .then(paymentData => res.json({ data: paymentData.body, success: true }))
      .catch(exception => res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: exception.message,
        success: false
      }));
  }

  postIndex(req, res) {
    this.paymentsLogService
      .sendPendingPayments(req.body, req)
      .then(sendPendingPayments => res.json({ data: sendPendingPayments.body, success: true }))
      .catch(err => res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: err.message,
        success: false
      }));
  }

  putIndex(req, res) {
    this.paymentsLogService
      .alterPaymentInstructionStatus(req.params.id, req.body, req)
      .then(() => res.json({ success: true }))
      .catch(err => response(res, err.body.errorMessage, HttpStatusCodes.BAD_REQUEST));
  }

  deleteIndex(req, res) {
    this.paymentsLogService
      .deletePaymentById(req.params.id, req)
      .then(() => res.json({ success: true }))
      .catch(err => res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: err.message,
        success: false
      }));
  }

  postCases(req, res) {
    this.paymentsLogService
      .createCaseNumber(req.params.id, req.body, req)
      .then(data => res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: data.body
      }))
      .catch(err => res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {},
        message: err.body,
        success: false
      }));
  }
}

module.exports = PaymentsLogController;
