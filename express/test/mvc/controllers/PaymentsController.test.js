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
    beforeEach(() => {
      errorResponse = () => {
        const error = new Error('this is an error');
        error.body = { message: 'this is an error message' };
        error.response = { statusCode: 400 };
        return Promise.reject(error);
      };
    });

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

  it('test handle exception when it is empty or null', () => {
    // Exception is empty
    paymentsController = new PaymentsController({});
    let exception = {};
    let respStatus = null;
    let respJson = null;
    const resp = {
      status: stat => {
        respStatus = stat;
      },
      json: j => {
        respJson = j;
      }
    };
    paymentsController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(respJson.success).to.equal(false);

    // Exception is null
    respStatus = null;
    respJson = null;
    exception = null;

    paymentsController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(respJson.success).to.equal(false);
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

  it('test exception handling with valid exception', () => {
    paymentsController = new PaymentsController({});
    const exception = {
      body: { message: 'this is an error message' },
      response: { statusCode: 403 }
    };
    let respStatus = null;
    let respJson = null;
    const resp = {
      status: stat => {
        respStatus = stat;
      },
      json: j => {
        respJson = j;
      }
    };
    paymentsController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.FORBIDDEN);
    expect(respJson.success).to.equal(false);
    expect(respJson.message).to.equal('this is an error message');
  });
});
