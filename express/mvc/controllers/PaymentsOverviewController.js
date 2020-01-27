const { paymentsOverviewService, utilService } = require('../../services');

const { response } = utilService;

class PaymentsOverviewController {
  constructor() {
    this.indexAction = this.indexAction.bind(this);
    this.piStatsOverview = this.piStatsOverview.bind(this);
    this.piRecordedData = this.piRecordedData.bind(this);
    this.paymentsOverviewService = paymentsOverviewService;
    this.response = response;
  }

  indexAction(req, res, next) {
    return this.paymentsOverviewService
      .getOverviews(req)
      .then(paymentOverviews => this.response(res, paymentOverviews.body))
      .catch(err => next(err));
  }

  piStatsOverview(req, res, next) {
    return this.paymentsOverviewService
      .getPiStatsOverviews(req)
      .then(paymentOverviews => this.response(res, paymentOverviews.body))
      .catch(err => next(err));
  }

  piRecordedData(req, res, next) {
    return this.paymentsOverviewService
      .getRecordedData(req)
      .then(data => this.response(res, data.body))
      .catch(err => next(err));
  }
}

module.exports = PaymentsOverviewController;
