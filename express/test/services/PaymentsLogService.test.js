// require modules
const chai = require('chai');
const mocha = require('mocha');
// nock = require('nock'),
// path = require('path'),
// supertest = require('supertest');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect;

// const FeeLogMock = require('./PaymentsLogService.mock');

const PaymentsLogService = require('../../services/PaymentsLogService');

// start tests
describe('Test: PaymentsLogService', () => {
  // afterEach(() => {});
  // beforeEach(() => {});

  it('searchPaymentsLog when query is a word', () => {
    const makeHttpRequest = function(...args) {
      expect(args[0].uri).to.equal('http://localhost:8080/payment-instructions?status=D,P,PA,V,A,TTB,C,REJ,RDM&caseReference=John&authorizationCode=John&payerName=John');
    };
    const paymentsLogService = new PaymentsLogService(makeHttpRequest);
    const query = { status: 'D,P,PA,V,A,TTB,C,REJ,RDM', query: 'John' };
    const req = {};
    paymentsLogService.searchPaymentsLog(query, req);
  });

  it('searchPaymentsLog when query is multiple word', () => {
    const makeHttpRequest = function(...args) {
      expect(args[0].uri).to.equal('http://localhost:8080/payment-instructions?status=D,P,PA,V,A,TTB,C,REJ,RDM&caseReference=John Doe&authorizationCode=John Doe&payerName=John Doe');
    };
    const paymentsLogService = new PaymentsLogService(makeHttpRequest);
    const query = { status: 'D,P,PA,V,A,TTB,C,REJ,RDM', query: 'John Doe' };
    const req = {};
    paymentsLogService.searchPaymentsLog(query, req);
  });

  it('searchPaymentsLog when query is number', () => {
    const makeHttpRequest = function(...args) {
      expect(args[0].uri).to.equal('http://localhost:8080/payment-instructions?status=D,P,PA,V,A,TTB,C,REJ,RDM&caseReference=123456&allPayInstructionId=123456&chequeNumber=123456&dailySequenceId=123456&postalOrderNumber=123456&authorizationCode=123456');
    };
    const paymentsLogService = new PaymentsLogService(makeHttpRequest);
    const query = { status: 'D,P,PA,V,A,TTB,C,REJ,RDM', query: '123456' };
    const req = {};
    paymentsLogService.searchPaymentsLog(query, req);
  });

  it('searchPaymentsLog when query is a sequence number', () => {
    const makeHttpRequest = function(...args) {
      expect(args[0].uri).to.equal('http://localhost:8080/payment-instructions?status=D,P,PA,V,A,TTB,C,REJ,RDM&caseReference=12A0074&dailySequenceId=12A0074');
    };
    const paymentsLogService = new PaymentsLogService(makeHttpRequest);
    const query = { status: 'D,P,PA,V,A,TTB,C,REJ,RDM', query: '12A0074' };
    const req = {};
    paymentsLogService.searchPaymentsLog(query, req);
  });
  it('searchPaymentsLog when query starts with RC- or RM-', () => {
    const makeHttpRequest = function(...args) {
      expect(args[0].uri).to.equal('http://localhost:8080/payment-instructions?status=D,P,PA,V,A,TTB,C,REJ,RDM&caseReference=RC-&payhubReference=RC-');
    };
    const paymentsLogService = new PaymentsLogService(makeHttpRequest);
    const query = { status: 'D,P,PA,V,A,TTB,C,REJ,RDM', query: 'RC-' };
    const req = {};
    paymentsLogService.searchPaymentsLog(query, req);
  });
});
