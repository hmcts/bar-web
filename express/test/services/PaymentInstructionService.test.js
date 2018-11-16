// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  mocha = require('mocha');
const PaymentInstructionService = require('../../services/PaymentInstructionService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

// start tests
describe('Test: PaymentInstructionService', () => {
  let req = {}, res = {};
  beforeEach(() => {
    req = { query: { code: '' }, params: {} };
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

  it('getByIdamId', async() => {
    const userId = 1;
    const query = { caseReference: 'abc1123' };
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentInstructionService = new PaymentInstructionService(makeHttpRequest);
    const respPromise = await paymentInstructionService.getByIdamId(userId, query, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/users/1/payment-instructions?caseReference=abc1123&caseReference=abc1123');
  });

  it('getStats', async() => {
    const userId = 1;
    const queryString = '?status=PA';
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentInstructionService = new PaymentInstructionService(makeHttpRequest);
    const respPromise = await paymentInstructionService.getStats(userId, queryString, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/users/1/payment-instructions/action-stats?status=PA');
  });

  it('getCount', async() => {
    const queryString = '?status=PA&userId=1';
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentInstructionService = new PaymentInstructionService(makeHttpRequest);
    const respPromise = await paymentInstructionService.getCount(queryString, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/payment-instructions/count?status=PA&userId=1');
  });
});
