const HttpStatusCodes = require('http-status-codes');
const { utilService } = require('./../../services');
const path = require('path');

const { response, errorHandler } = utilService;

class PaymentInstructionController {
  constructor({ paymentInstructionService }) {
    this.scriptName = path.basename(__filename);
    this.indexAction = this.indexAction.bind(this);
    this.patchPaymentInstruction = this.patchPaymentInstruction.bind(this);
    this.getStats = this.getStats.bind(this);
    this.sendToPayhub = this.sendToPayhub.bind(this);
    this.getCount = this.getCount.bind(this);

    // pass service that was injected
    this.paymentInstructionService = paymentInstructionService;
  }

  indexAction(req, res) {
    const { id } = req.params;
    return this.paymentInstructionService
      .getByIdamId(id, req.query, req)
      .then(paymentInstructions => response(res, paymentInstructions.body))
      .catch(err => response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }

  patchPaymentInstruction(req, res) {
    return this.paymentInstructionService
      .rejectPaymentInstruction(req.params.id, req.body, req, 'PATCH')
      .then(result => response(res, result.body))
      .catch(err => response(res, err.body, HttpStatusCodes.INTERNAL_SERVER_ERROR));
  }

  getStats(req, res) {
    const { id } = req.params;
    const queryString = req.url.substring(req.url.indexOf('?'));
    this.paymentInstructionService.getStats(id, queryString, req)
      .then(stats => res.json({ data: stats.body, success: true }))
      .catch(err => response(res, err.body, HttpStatusCodes.INTERNAL_SERVER_ERROR));
  }

  getCount(req, res) {
    const queryString = req.url.substring(req.url.indexOf('?'));
    return this.paymentInstructionService.getCount(queryString, req)
      .then(statusCount => res.json({ data: statusCount.body, success: true }))
      .catch(err => response(res, err.body, HttpStatusCodes.INTERNAL_SERVER_ERROR));
  }


  async sendToPayhub(req, res) {
    const { timestamp } = req.params;
    try {
      const resp = await this.paymentInstructionService.sendToPayhub(timestamp, req);
      res.json(resp.body);
    } catch (error) {
      errorHandler(res, error, this.scriptName);
    }
  }
}

module.exports = PaymentInstructionController;
