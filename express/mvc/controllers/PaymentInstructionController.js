const HttpStatusCodes = require('http-status-codes');
const { utilService } = require('./../../services');

const { response } = utilService;

class PaymentInstructionController {
  constructor({ paymentInstructionService }) {
    this.indexAction = this.indexAction.bind(this);
    this.patchPaymentInstruction = this.patchPaymentInstruction.bind(this);
    this.getStats = this.getStats.bind(this);
    this.sendToPayhub = this.sendToPayhub.bind(this);

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
    this.paymentInstructionService
      .rejectPaymentInstruction(req.params.id, req.body, req, 'PATCH')
      .then(result => response(res, result.body))
      .catch(err => response(res, err.body, HttpStatusCodes.INTERNAL_SERVER_ERROR));
  }

  getStats(req, res) {
    const { id } = req.params;
    const queryString = req.url.substring(req.url.indexOf('?'));
    this.paymentInstructionService.getStats(id, queryString, req)
      .then(stats => {
        res.json({ data: stats.body, success: true });
      })
      .catch(err => {
        response(res, err.body, HttpStatusCodes.INTERNAL_SERVER_ERROR);
      });
  }

  async sendToPayhub(req, res) {
    try {
      const resp = await this.paymentInstructionService.sendToPayhub(req);
      if (resp.status >= HttpStatusCodes.BAD_REQUEST) {
        throw new Error(resp.body);
      }
      res.json({ data: resp.body, success: true });
    } catch (error) {
      response(res, error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = PaymentInstructionController;
