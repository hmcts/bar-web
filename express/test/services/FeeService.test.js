// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  mocha = require('mocha');
const FeeService = require('../../services/FeeService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

// start tests
describe('Test: FeeService', () => {
  let req = {}, res = {};
  beforeEach(() => {
    req = { query: {}, params: {} };
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

  it('getFees', async() => {
    const feeService = new FeeService({});
    const respPromise = await feeService.getFees(req);
    const respLength = 219;
    expect(respPromise.body.length).to.equal(respLength);
  });

  it('addEditFeeToCase', async() => {
    const id = 3;
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const respPromise = await feeService.addEditFeeToCase(id, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/fees');
    expect(respPromise.method).to.equal('POST');
  });

  it('searchForFee with empty query', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const respPromise = await feeService.searchForFee(req);
    expect(respPromise.uri).to.equal('http://localhost:23443/fees');
    expect(respPromise.method).to.equal('GET');
  });

  it('searchForFee with valid query', async() => {
    req.query.query = 'divorce';
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const respPromise = await feeService.searchForFee(req);
    expect(respPromise.uri).to.equal('http://localhost:23443/fees?description=divorce');
    expect(respPromise.method).to.equal('GET');
  });

  it('removeFeeFromPaymentInstruction', async() => {
    const id = 3;
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const respPromise = await feeService.removeFeeFromPaymentInstruction(id, req);
    expect(respPromise.uri).to.equal('http://localhost:8080/fees/3');
    expect(respPromise.method).to.equal('DELETE');
  });
});
