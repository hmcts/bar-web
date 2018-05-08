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
    return request(this.configureOpts(opts, req));
  }

  configureOpts(opts, req) {
    if (!opts.hasOwnProperty('uri') || !opts.hasOwnProperty('method')) {
      throw new Error('"uri" and "method" should contain data.');
    }

    if (opts.uri.length < 1 || opts.method.length < 1) {
      throw new Error('"uri" and "method" should not be blank');
    }

    if ((typeof opts !== 'object') || (req && typeof req !== 'object')) {
      throw new Error('Please ensure "opts" and "request" are of type "Object".');
    }

    opts.json = opts.json == null ? true : opts.json;
    if (!opts.headers) {
      opts.headers = {};
    }
    opts.headers['Content-Type'] = opts.headers['Content-Type'] == null ? 'application/json' : opts.headers['Content-Type'];
    if (req && req.cookies[constants.SECURITY_COOKIE]) {
      const bearer = req.cookies[constants.SECURITY_COOKIE];
      opts.headers.Authorization = `Bearer ${bearer}`;
    }

    if (opts.hasOwnProperty('method') && opts.method === 'DELETE') {
      opts.json = false;
    }

    return opts;
  }
}

module.exports = BaseService;
