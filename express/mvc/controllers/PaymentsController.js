const { paymentService, paymentInstructionService } = require('../../services');
const { Logger } = require('@hmcts/nodejs-logging');

class PaymentsController {
  constructor({ response }) {
    // declare the services first
    this.paymentInstructionService = paymentInstructionService;
    this.paymentService = paymentService;
    this.response = response;

    this.indexAction = this.indexAction.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.postIndex = this.postIndex.bind(this);
    this.getUnallocated = this.getUnallocated.bind(this);
  }

  indexAction(req, res) {
    const data = [];
    const { id } = req.params;

    return this.paymentInstructionService
      .searchPaymentsLog(req.query, req)
      .then(resp => this.response(res, { data, id, resp }))
      .catch(err => this.response(res, { id, err }));
  }

  getIndex(req, res) {
    return this.paymentService
      .getPaymentTypes(req)
      .then(paymentTypes => this.response(res, paymentTypes.body))
      .catch(exception => this.response(res, {
        data: {},
        message: exception.message
      }, exception.response.statusCode));
  }

  postIndex(req, res, appInsights) {
    const { type } = req.params;
    return this.paymentService
      .sendPaymentDetails(req.body, type, req)
      .then(sendPaymentDetails => {
        this.response(res, sendPaymentDetails.body);
        this.sendAppInsightsData(req, appInsights, type);
      })
      .catch(exception => this.response(res, {
        data: {},
        message: exception.message
      }, exception.response.statusCode));
  }

  getUnallocated(req, res) {
    return this.paymentService
      .getUnallocatedAmount(req.params.id, req)
      .then(amount => this.response(res, amount.body))
      .catch(paymentTypes => this.response(res, paymentTypes.body));
  }

  sendAppInsightsData(req, appInsights, type) {
    try {
      if (req.body.id && req.body.status === 'P') {
        appInsights.defaultClient.trackEvent({
          name: 'payment_instruction_submit',
          properties: {
            payment_id: req.body.id,
            amount: req.body.amount,
            type
          }
        });
      }
    } catch (ex) {
      Logger.getLogger('BAR-WEB: PaymentsController.js').error(ex);
    }
  }
}

module.exports = PaymentsController;
