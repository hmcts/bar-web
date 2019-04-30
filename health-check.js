const HttpStatus = require('http-status-codes');
const request = require('client-request');
const config = require('config');

const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';

function check(req, res) {
  status = {};
  request({
    uri: `${feeUrl}/health/liveness`,
    method: 'GET',
    timeout: 1000,
    json: true
  }, (err, response) => {
    if (err || response.statusCode > HttpStatus.CREATED) {
      status.status = 'DOWN';
      status.details = {
        fee_search: {
          status: 'DOWN',
          details: err || `status_code: ${response.statusCode}`
        }
      };
    } else {
      status.status = 'UP';
      status.details = { fee_search: { status: 'UP' } };
    }
    res.status(HttpStatus.OK).json(status);
  });
}

module.exports = check;