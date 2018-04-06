/* eslint-disable no-eq-null, eqeqeq */
const request = require('client-request/promise');
const constants = require('../infrastructure/security').constants;

class BaseService {
  /**
   * Decorate request with the proper headers
   * @param {*} opts - the remote request payload
   * @param {*} req - the original reques from the browser
   */
  request(opts, req) {
    opts.json = opts.json == null ? true : opts.json;
    if (!opts.headers) {
      opts.headers = {};
    }
    opts.headers['Content-Type'] = opts.headers['Content-Type'] == null ? 'application/json' : opts.headers['Content-Type'];
    if (req && req.cookies[constants.SECURITY_COOKIE]) {
      const bearer = req.cookies[constants.SECURITY_COOKIE];
      opts.headers.Authorization = `Bearer ${bearer}`;
    }
    return request(opts);
  }
}

module.exports = BaseService;
