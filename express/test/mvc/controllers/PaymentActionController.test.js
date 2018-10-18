const chai = require('chai'),
  mocha = require('mocha');
const PaymentActionController = require('../../../mvc/controllers/PaymentActionController');
const { response } = require('../../../services/UtilService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

let paymentActionService = null;
let paymentActionController = null;
let req = {}, res = {};

// start tests
describe('Test: PaymentActionController', () => {
  beforeEach(() => {
    paymentActionService = {
      getPaymentActions() {
        return Promise.resolve({
          success: true,
          data: []
        });
      }
    };
    paymentActionController = new PaymentActionController({ response, paymentActionService });
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

  it('Test indexAction: success', async() => {
    await paymentActionController.indexAction(req, res);

    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    // expect(res.respMessage.action).to.equal('something');
  });
});