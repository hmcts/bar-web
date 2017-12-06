const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class FeeLogService {
  getFeeLog() {
    return request({
      uri: `${barUrl}/fee-log`,
      method: "GET",
      json: true,
      headers: {
      'Content-Type': 'application/json'
      }
    });
  }
}

module.exports = FeeLogService;
