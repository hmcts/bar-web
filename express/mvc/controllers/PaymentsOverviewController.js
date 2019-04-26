const { paymentsOverviewService, utilService } = require('../../services');

const { response } = utilService;

class PaymentsOverviewController {
  constructor() {
    this.indexAction = this.indexAction.bind(this);
    this.piStatsOverview = this.piStatsOverview.bind(this);
    this.paymentsOverviewService = paymentsOverviewService;
  }

  indexAction(req, res, next) {
    return this.paymentsOverviewService
      .getOverviews(req)
      .then(paymentOverviews => response(res, paymentOverviews.body))
      .catch(err => next(err));
  }

  piStatsOverview(req, res, next) {
    return this.paymentsOverviewService
      .getPiStatsOverviews(req)
      .then(paymentOverviews => response(res, paymentOverviews.body))
      .catch(err => next(err));
  }
}

module.exports = PaymentsOverviewController;
