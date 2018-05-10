const { paymentsOverviewService, utilService } = require('../../services');

const { response } = utilService;

class PaymentsOverviewController {
  constructor() {
    this.indexAction = this.indexAction.bind(this);
    this.paymentsOverviewService = paymentsOverviewService;
  }

  indexAction(req, res) {
    return this.paymentsOverviewService
      .getOverviews(req)
      .then(paymentOverviews => response(res, paymentOverviews.body))
      .catch(err => response(res, err.body.message, err.body.status));
  }
}

module.exports = PaymentsOverviewController;
