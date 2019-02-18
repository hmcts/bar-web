const chai = require('chai'),
  mocha = require('mocha'),
  sinon = require('sinon');


const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

const PaymentsLogService = require('../../../services/PaymentsLogService');
const PaymentsLogController = require('../../../mvc/controllers/PaymentsLogController');
const HttpStatusCodes = require('http-status-codes');

let errorResponse = {};

describe('Unit test -> PaymentsLogController: ', () => {
  beforeEach(() => {
    errorResponse = () => {
      const error = new Error('this is an error');
      error.body = { message: 'this is an error message' };
      error.response = { statusCode: 400 };
      return Promise.reject(error);
    };
  });

  function testMethodErrorHandling(methodName, serviceMethodName, done) {
    const paymentsLogService = new PaymentsLogService({});
    paymentsLogService[serviceMethodName] = errorResponse;
    const controller = new PaymentsLogController({ paymentsLogService });
    const req = { query: '', params: { id: 1 } };
    const res = {
      status: status => {
        expect(status).to.equal(HttpStatusCodes.BAD_REQUEST);
      },
      json: j => {
        expect(j.success).to.equal(false);
        expect(j.message).to.equal('this is an error message');
        done();
      }
    };
    controller[methodName](req, res);
  }

  it('test handle exception when it is empty or null', () => {
    // Exception is empty
    const paymentsLogController = new PaymentsLogController({});
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
    paymentsLogController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(respJson.success).to.equal(false);

    // Exception is null
    respStatus = null;
    respJson = null;
    exception = null;

    paymentsLogController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(respJson.success).to.equal(false);
  });

  it('test exception handling with valid exception', () => {
    const paymentsLogController = new PaymentsLogController({});
    const exception = {
      body: { message: 'this is an error message' },
      response: { statusCode: 400 }
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
    paymentsLogController.handleException(exception, resp);
    expect(respStatus).to.equal(HttpStatusCodes.BAD_REQUEST);
    expect(respJson.success).to.equal(false);
    expect(respJson.message).to.equal('this is an error message');
  });

  it('getIndex() error handling', done => {
    const paymentsLogService = new PaymentsLogService({});
    paymentsLogService.getPaymentsLog = errorResponse;
    sinon.spy(paymentsLogService, 'getPaymentsLog');
    const controller = new PaymentsLogController({ paymentsLogService });
    const req = { query: '' };
    const res = {
      status: status => {
        expect(status).to.equal(HttpStatusCodes.BAD_REQUEST);
      },
      json: j => {
        expect(j.success).to.equal(false);
        expect(j.message).to.equal('this is an error message');
        done();
      }
    };
    controller.getIndex(req, res);
    expect(paymentsLogService.getPaymentsLog.calledOnce).to.equal(true);
    expect(paymentsLogService.getPaymentsLog.getCall(0).args[0]).to.equal('');
    expect(paymentsLogService.getPaymentsLog.getCall(0).args[2]).to.equal('');
  });

  it('getIndex() request parameter handling', () => {
    const paymentsLogService = new PaymentsLogService({});
    paymentsLogService.getPaymentsLog = errorResponse;
    sinon.spy(paymentsLogService, 'getPaymentsLog');
    const controller = new PaymentsLogController({ paymentsLogService });
    const req = { query: { format: 'format', status: 'status' } };
    // eslint-disable-next-line no-empty-function
    const res = { status: () => {}, json: () => {} };
    controller.getIndex(req, res);
    expect(paymentsLogService.getPaymentsLog.getCall(0).args[0]).to.equal('status');
    expect(paymentsLogService.getPaymentsLog.getCall(0).args[2]).to.equal('format');
  });

  it('getById() error handling', done => {
    testMethodErrorHandling('getById', 'getPaymentById', done);
  });

  it('postIndex() error handling', done => {
    testMethodErrorHandling('postIndex', 'sendPendingPayments', done);
  });

  it('putIndex() error handling', done => {
    testMethodErrorHandling('putIndex', 'alterPaymentInstructionStatus', done);
  });

  it('deleteIndex() error handling', done => {
    testMethodErrorHandling('deleteIndex', 'deletePaymentById', done);
  });

  it('postCases() error handling', done => {
    testMethodErrorHandling('postCases', 'createCaseNumber', done);
  });
});
