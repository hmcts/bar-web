const config = require('config');
const UtilService = require('./UtilService');

const { makeHttpRequest } = UtilService;
const barUrl = config.get('bar.url');

class PaymentsOverviewService {
  getOverviews(req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-stats?userRole=${req.query.userRole}&status=${req.query.status}`,
      method: 'GET'
    }, req);
  }
}

module.exports = PaymentsOverviewService;
