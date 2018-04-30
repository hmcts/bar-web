const config = require('config');
const BaseService = require('../services/BaseService');

const barUrl = config.get('bar.url');

class PaymentsOverviewService extends BaseService {
  getOverviews(req) {
    return this.request({
      uri: `${barUrl}/payments-overview`,
      method: 'GET'
    }, req);
  }
}

module.exports = PaymentsOverviewService;
