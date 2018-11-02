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

  it('getJurisdictions', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const request = { query: { jurisdiction: '1' } };
    const response = await feeService.getJurisdictions(request);
    expect(response.uri).to.equal('http://localhost:23443/jurisdictions1');
    expect(response.method).to.equal('GET');
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

  it('searchForFee with number in query', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    // temporarily insert a "query" query property / key
    req.query = { query: '550', jurisdiction1: 'family', jurisdiction2: 'county court' };
    const respPromise = await feeService.searchForFee(req);
    expect(respPromise.uri).to.equal('http://localhost:23443/fees?isDraft=false&isActive=true&isExpired=false&feeVersionAmount=550&jurisdiction1=family&jurisdiction2=county court');
    expect(respPromise.method).to.equal('GET');
  });

  it('searchForFee with number in query', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    // temporarily insert a "string" query property / key
    req.query = { query: 'fee' };
    const respPromise = await feeService.searchForFee(req);
    expect(respPromise.uri).to.equal('http://localhost:23443/fees?isDraft=false&isActive=true&isExpired=false&description=fee');
    expect(respPromise.method).to.equal('GET');
  });

  it('searchForFee with valid query', async() => {
    req.query.query = 'divorce';
    const makeHttpRequest = opts => Promise.resolve(opts);
    const feeService = new FeeService(makeHttpRequest);
    const respPromise = await feeService.searchForFee(req);
    expect(respPromise.uri).to.equal('http://localhost:23443/fees?isDraft=false&isActive=true&isExpired=false&description=divorce');
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
