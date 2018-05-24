// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  mocha = require('mocha');
const PaymentService = require('../../services/PaymentService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

// start tests
describe('Test: PaymentService', () => {
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

  it('getPaymentTypes', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentService = new PaymentService(makeHttpRequest);
    const respPromise = await paymentService.getPaymentTypes(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/payment-types');
    expect(respPromise.method).to.equal('GET');
  });

  it('getUnallocatedAmount', async() => {
    const id = 3;
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentService = new PaymentService(makeHttpRequest);
    const respPromise = await paymentService.getUnallocatedAmount(id, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/payment-instructions/3/unallocated');
    expect(respPromise.method).to.equal('GET');
  });

  it('sendPaymentDetails', async() => {
    const body = {};
    const type = 'cards';
    const makeHttpRequest = opts => Promise.resolve(opts);
    const paymentService = new PaymentService(makeHttpRequest);
    const respPromise = await paymentService.sendPaymentDetails(body, type, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/cards');
    expect(respPromise.method).to.equal('POST');
  });
});
