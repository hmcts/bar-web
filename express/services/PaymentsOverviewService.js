const config = require('config');
const UtilService = require('./UtilService');

const { makeHttpRequest } = UtilService;
const barUrl = config.get('bar.url');

class PaymentsOverviewService {
  getOverviews(req) {
    return makeHttpRequest({
<<<<<<< HEAD
      uri: `${barUrl}/payment-stats`,
=======
      uri: `${barUrl}/payment-stats?userRole=${req.query.userRole}&status=${req.query.status}`,
>>>>>>> 5d38e2ef88c4b6ec21ec520b5508e0e230156d0a
      method: 'GET'
    }, req);
  }
}

module.exports = PaymentsOverviewService;
