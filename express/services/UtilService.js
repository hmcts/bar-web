/* eslint-disable no-eq-null, eqeqeq */
const rq = require('client-request/promise');
const constants = require('../infrastructure/security').constants;
const HttpStatusCodes = require('http-status-codes');
const { Logger } = require('@hmcts/nodejs-logging');
const circuitBreaker = require('opossum');

const breakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

function asyncTo(promise) {
  return promise.then(data => [null, data]).catch(err => [err]);
}

function setConfig(options, request) {
  if (!options.hasOwnProperty('uri') || !options.hasOwnProperty('method')) {
    throw new Error('"uri" and "method" should contain data.');
  }

  if (options.uri.length < 1 || options.method.length < 1) {
    throw new Error('"uri" and "method" should not be blank');
  }

  if (typeof options !== 'object' || (request && typeof request !== 'object')) {
    throw new Error(
      'Please ensure "options" and "request" are of type "Object".'
    );
  }

  options.json = options.json == null ? true : options.json;
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['Content-Type'] = options.headers['Content-Type'] == null ? 'application/json' : options.headers['Content-Type'];
  if (request && request.cookies[constants.SECURITY_COOKIE]) {
    const bearer = request.cookies[constants.SECURITY_COOKIE];
    options.headers.Authorization = `Bearer ${bearer}`;
    const siteId = request.cookies[constants.SITEID_COOKIE];
    options.headers.SiteId = siteId ? siteId : '';
  }

  if (options.hasOwnProperty('method') && options.method === 'DELETE') {
    options.json = false;
  }

  return options;
}

function response(res, data, status = HttpStatusCodes.OK) {
  let success = true;
  if (status >= HttpStatusCodes.BAD_REQUEST) {
    success = false;
  }

  return res.status(status).json({ success, data });
}

function errorHandler(res, error, fileName) {
  Logger.getLogger(`BAR-WEB: ${fileName}`).error(error.body || error.message);
  res.status(error.response ? error.response.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR : HttpStatusCodes.INTERNAL_SERVER_ERROR);
  res.send(error.body || error.message);
}

function requestWhichCouldBreak(options, request) {
  return rq(setConfig(options, request));
}

const breaker = circuitBreaker(requestWhichCouldBreak, breakerOptions);

/**
 * Decorate http request options
 * @param {Object} options
 * @param {XMLHttpRequest} request
 */
function makeHttpRequest(options, request) {
  return breaker.fire(options, request);
}

module.exports = { asyncTo, makeHttpRequest, response, setConfig, errorHandler };
