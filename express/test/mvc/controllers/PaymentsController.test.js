// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  mocha = require('mocha');
const PaymentsController = require('../../../mvc/controllers/PaymentsController');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

const { response } = require('./../../../services/UtilService');
const HttpStatusCodes = require('http-status-codes');

let paymentInstructionService = null;
let paymentService = null;
let paymentsController = null;
let req = {}, res = {};

// start tests
describe('Test: PaymentsController', () => {
  beforeEach(() => {
    paymentInstructionService = {};
    paymentService = {};
    paymentsController = new PaymentsController({ response });
    paymentsController.paymentInstructionService = paymentInstructionService;
    paymentsController.paymentService = paymentService;
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
    paymentInstructionService.searchPaymentsLog = () => Promise.resolve({ body: 'something' });
    await paymentsController.indexAction(req, res);
    expect(res.respMessage).to.have.property('data');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
  });

  it('Test getIndex: success', async() => {
    paymentService.getPaymentTypes = () => Promise.resolve({ body: 'something' });
    await paymentsController.getIndex(req, res);
    expect(res.respMessage).to.have.property('data');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
  });

  it('Test postIndex: success', async() => {
    paymentService.sendPaymentDetails = () => Promise.resolve({ body: 'something' });
    await paymentsController.postIndex(req, res);
    expect(res.respMessage).to.have.property('data');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.data).to.equal('something');
  });

  it('Test getUnallocated: success', async() => {
    req.params.id = 2;
    paymentService.getUnallocatedAmount = () => Promise.resolve({ body: 'something' });
    await paymentsController.getUnallocated(req, res);
    expect(res.respMessage).to.have.property('data');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.data).to.equal('something');
  });

  it('test getStatusCode() when we have status code in the error', () => {
    const e = new Error('Some error');
    e.response = { statusCode: HttpStatusCodes.BAD_REQUEST };
    expect(paymentsController.getStatusCode(e)).to.equal(HttpStatusCodes.BAD_REQUEST);
  });

  it('test getStatusCode() when the error is general', () => {
    const e = new Error('Some error');
    expect(paymentsController.getStatusCode(e)).to.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });
});
