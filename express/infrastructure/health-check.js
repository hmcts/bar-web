const HttpStatus = require('http-status-codes');
const request = require('client-request');
const config = require('config');
const circuitBreaker = require('opossum');

const feeUrl = config.has('fee.url') ? config.get('fee.url') : '';


function asyncFunctionThatCouldFail() {
  return new Promise((resolve, reject) => {
    const status = {};
    request({
      uri: `${feeUrl}/health/liveness`,
      method: 'GET',
      timeout: 1000,
      json: true
    }, (err, response) => {
      if (err) {
        reject(err);
        return;
      } else if (response.statusCode > HttpStatus.CREATED) {
        status.status = 'DOWN';
        status.details = {
          fee_search: {
            status: 'DOWN',
            details: `status_code: ${response.statusCode}`
          }
        };
      } else {
        status.status = 'UP';
        status.details = { fee_search: { status: 'UP' } };
      }
      resolve(status);
    });
  });
}

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};
const breaker = circuitBreaker(asyncFunctionThatCouldFail, options);


function check(req, res) {
  breaker.fire()
    .then(status => res.status(HttpStatus.OK).json(status))
    .catch(err => {
      res.status(HttpStatus.OK).json({
        status: 'DOWN',
        details: {
          fee_search: {
            status: 'DOWN',
            details: err
          }
        }
      });
    });
}

module.exports = check;