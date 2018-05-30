const mocha = require('mocha');
const chai = require('chai');
const fees = require('../../mvc/middleware/fees');
const httpStatusCodes = require('http-status-codes');

const describe = mocha.describe,
  it = mocha.it,
  beforeEach = mocha.beforeEach,
  expect = chai.expect;

describe('test Fee middleware', () => {
  let nextCalled = false;
  let req = {}, res = {};
  const next = () => {
    nextCalled = true;
  };

  beforeEach(() => {
    nextCalled = false;
    req = { query: { code: '' } };
    res = {
      statusCode: '',
      respMessage: {},
      status: code => {
        res.statusCode = code;
        return res;
      },
      json: message => {
        res.respMessage = message;
      }
    };
  });

  it('validate fee parameters when empty query', () => {
    fees.validateFeeController(req, res, next);
    expect(nextCalled).to.equal(true);
  });

  it('validate fee parameters when undefined query', () => {
    // eslint-disable-next-line
    req.query.code = undefined;
    fees.validateFeeController(req, res, next);
    expect(nextCalled).to.equal(true);
  });

  it('validate fee parameters when alphanumeric query', () => {
    // eslint-disable-next-line
    req.query.code = '1234abc';
    fees.validateFeeController(req, res, next);
    expect(nextCalled).to.equal(true);
  });


  it('validate fee parameters when not aplhanumeric query', () => {
    // eslint-disable-next-line
    req.query.code = '__';
    fees.validateFeeController(req, res, next);
    expect(res.statusCode).to.equal(httpStatusCodes.BAD_REQUEST);
    expect(res.respMessage.message).to.equal('Invalid parameters.');
    expect(nextCalled).to.equal(false);
  });
});