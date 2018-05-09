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
      .then(paymentOverviews => response(res, paymentOverviews.body));
  }
}

module.exports = PaymentsOverviewController;
