const BaseController = require('../controllers/BaseController');
const { paymentsOverviewService } = require('../../services');

class PaymentsOverviewController extends BaseController {
  constructor() {
    super();
    this.indexAction = this.indexAction.bind(this);
    this.paymentsOverviewService = paymentsOverviewService;
  }

  indexAction(req, res) {
    return this.paymentsOverviewService
      .getOverviews(req)
      .then(paymentOverviews => this.response(res, paymentOverviews.body))
      .catch(err => this.response(res, err.body.message, err.body.status));
  }
}

module.exports = PaymentsOverviewController;
