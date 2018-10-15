const chai = require('chai'),
  mocha = require('mocha');

  // get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

const PaymentActionService = require('../../services/PaymentActionService');

// start tests
describe('Test: PaymentActionService', () => {
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
    const httpRequest = opts => Promise.resolve(opts);
    const paymentActionService = new PaymentActionService({ httpRequest });
    const respPromise = await paymentActionService.getPaymentActions(req);
    expect(respPromise.uri).contain('/payment-action');
    expect(respPromise.method).to.equal('GET');
  });
});
