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

  getPiStatsOverviews(req) {
    return makeHttpRequest({
      uri: `${barUrl}/users/pi-stats?status=${req.query.status}`,
      method: 'GET'
    }, req);
  }

  getRejectStatsOverviews(req) {
    return makeHttpRequest({
      uri: `${barUrl}/users/pi-rejected-stats?currentStatus=${req.query.currentStatus}&oldStatus=${req.query.oldStatus}`,
      method: 'GET'
    }, req);
  }
}

module.exports = PaymentsOverviewService;
