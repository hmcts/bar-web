const HttpStatusCodes = require('http-status-codes');

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
            .send(resp.body);
        }
        return res.json({ data: resp.body, success: true });
      })
      .catch(exception => this.handleException(exception, res));
  }

  searchIndex(req, res) {
    this.paymentsLogService
      .searchPaymentsLog(req.query, req)
      .then(data => res.json({ data: data.body, success: true }))
      .catch(err => this.handleException(err, res));
  }

  getById(req, res) {
    this.paymentsLogService
      .getPaymentById(req.params.id, req)
      .then(paymentData => res.json({ data: paymentData.body, success: true }))
      .catch(exception => this.handleException(exception, res));
  }

  postIndex(req, res) {
    this.paymentsLogService
      .sendPendingPayments(req.body, req)
      .then(sendPendingPayments => res.json({ data: sendPendingPayments.body, success: true }))
      .catch(err => this.handleException(err, res));
  }

  putIndex(req, res) {
    this.paymentsLogService
      .alterPaymentInstructionStatus(req.params.id, req.body, req)
      .then(() => res.json({ success: true }))
      .catch(err => this.handleException(err, res));
  }

  deleteIndex(req, res) {
    this.paymentsLogService
      .deletePaymentById(req.params.id, req)
      .then(() => res.json({ success: true }))
      .catch(err => this.handleException(err, res));
  }

  postCases(req, res) {
    this.paymentsLogService
      .createCaseNumber(req.params.id, req.body, req)
      .then(data => res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: data.body
      }))
      .catch(err => this.handleException(err, res));
  }

  handleException(exception, resp) {
    if (exception.response && exception.response.statusCode) {
      resp.status(exception.response.statusCode);
    } else {
      resp.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    const body = exception.body;
    body.success = false;
    resp.json(exception.body);
  }
}

module.exports = PaymentsLogController;
