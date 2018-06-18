// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  httpStatusCodes = require('http-status-codes'),
  mocha = require('mocha'),
  supertest = require('supertest');
const security = require('../../../infrastructure/security-factory.mock.js');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  afterEach = mocha.afterEach,
  beforeEach = mocha.beforeEach;

// get classes / modules that'll be tested
const app = require('../../../../server')(security);

const testingPort = 9001;
let expressApp = null;
let PaymentsLogServiceMock = null;

const PaymentsLogService = require('../../services/PaymentsLogService.mock');

// start tests
describe('Test: PaymentsLogController', () => {
  beforeEach(done => {
    PaymentsLogServiceMock = new PaymentsLogService();
    expressApp = app.listen(testingPort, done);
  });

  afterEach(done => {
    expressApp.close(done);
  });

  it('Should only allow string for status', async() => {
    await supertest(expressApp)
      .get('/api/payment-instructions?status=123')
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('success');
        expect(body).to.have.property('message');
        expect(body.success).to.eqls(false);
        expect(body.message).to.eqls('Please ensure you add the right parameters.');
      });
  });

  // ensure we get payment logs
  it('Should retrieve all the payment logs.', async() => {
    PaymentsLogServiceMock.getPaymentsLog();

    await supertest(expressApp)
      .get('/api/payment-instructions?status=D')
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('data');
        expect(body).to.have.property('success');
        expect(body.success).to.eqls(true);
        expect(body.data).to.be.an('array');
      });
  });

  // it should get the payment by id
  it('Should get the payment by ID', async() => {
    const paymentId = 1;
    PaymentsLogServiceMock.getPaymentById(paymentId);

    await supertest(expressApp)
      .get(`/api/payment-instructions/${paymentId}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body).to.have.property('data');
        expect(body).to.have.property('success');
        expect(body.success).to.eqls(true);
        expect(body.data.id).to.equal(paymentId);
      });
  });

  it('Should successfully create a new payment log', async() => {
    const data = {
      payer_name: 'John Smith',
      amount: 1999,
      cheque_number: '079890',
      status: 'P'
    };
    PaymentsLogServiceMock.sendPendingPayments(data);

    await supertest(expressApp)
      .post('/api/payment-instructions', data)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // obviously, when creating data "id" field should be empty
        expect(data).to.not.have.property('id');

        // when payment has been created, "id" field should exist
        expect(body.data).to.have.property('id');

        // ...and the data expected back should been successful
        expect(body.success).to.eqls(true);
      });
  });

  it('Should successfully delete a payment instruction.', async() => {
    const paymentId = 2;
    PaymentsLogServiceMock.deletePaymentById(paymentId);

    await supertest(expressApp)
      .delete(`/api/payment-instructions/${paymentId}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // ...the data expected back should been successful
        expect(body.success).to.eqls(true);
      });
  });

  it('Should ensure that the payment instruction ID is a number', async() => {
    const paymentId = 'hello-world-123';
    PaymentsLogServiceMock.deletePaymentById(paymentId);

    await supertest(expressApp)
      .delete(`/api/payment-instructions/${paymentId}`)
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(res => {
        const { body } = res;

        expect(body).to.have.property('success');
        expect(body).to.have.property('message');
        expect(body.success).to.equal(false);
        expect(body.message).to.equal('ID must be a number');
      });
  });

  it('Should successfully create a new case-reference.', async() => {
    const paymentId = 1;
    const data = { case_reference: 1234567890 };
    PaymentsLogServiceMock.createCaseNumber(paymentId, data);

    await supertest(expressApp)
      .post(`/api/payment-instructions/${paymentId}/cases`)
      .expect(httpStatusCodes.CREATED)
      .expect(res => {
        const { body } = res;

        // ...the data expected back should been successful
        expect(body).to.have.property('success');
        expect(body.success).to.eqls(true);
        expect(body).to.have.property('data');
        expect(body.data.case_references).to.be.an('array');
        expect(body.data.case_references).to.not.be.empty; // eslint-disable-line no-unused-expressions
      });
  });

  it('Should successfully return a payment instruction with given daily sequence id', async() => {
    const dailySequenceId = 11111;
    PaymentsLogServiceMock.searchPaymentsLogByDailySequenceId(dailySequenceId);

    await supertest(expressApp)
      // the property name is "caseReferenceId", however, express discerns which property to send
      .get(`/api/payment-instructions/search?status=P&query=${dailySequenceId}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // ensure that i receive the right data back
        expect(body).to.have.property('success');
        expect(body).to.have.property('data');
        expect(body.success).to.equal(true);
        expect(body.data).to.have.lengthOf(1);
        expect(body.data[0]).to.have.property('daily_sequence_id');
        expect(body.data[0].daily_sequence_id).to.equal(dailySequenceId);
      });
  });


  it('Should successfully return a postal order payment instruction', async() => {
    const postalOrderNumber = 345678;
    PaymentsLogServiceMock.searchPaymentsLogByPostalOrderNumber(postalOrderNumber);

    await supertest(expressApp)
      .get(`/api/payment-instructions/search?status=P&query=${postalOrderNumber}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // ensure that i receive the right data back
        expect(body).to.have.property('success');
        expect(body).to.have.property('data');

        expect(body.success).to.equal(true);
        expect(body.data).to.have.lengthOf(1);
        expect(body.data[0]).to.have.property('postal_order_number');
      });
  });

  it('Should successfully return a cheque payment instruction', async() => {
    const chequeNumber = 123456;
    PaymentsLogServiceMock.searchPaymentsLogByChequeNumber(chequeNumber);

    await supertest(expressApp)
      .get(`/api/payment-instructions/search?status=P&query=${chequeNumber}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // ensure that i receive the right data back
        expect(body).to.have.property('success');
        expect(body).to.have.property('data');
        expect(body.success).to.equal(true);
        expect(body.data).to.have.lengthOf(1);
        expect(body.data[0]).to.have.property('cheque_number');
      });
  });

  it('Should change the status of payment to validated.', async() => {
    const paymentInstructionId = 1;
    const requestBody = { action: 'suspense', status: 'V' };
    PaymentsLogServiceMock.alterPaymentInstructionStatus(paymentInstructionId, requestBody);

    await supertest(expressApp)
      .put(`/api/payment-instructions/${paymentInstructionId}`)
      .send(requestBody)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;

        // ensure that we recieve the right data back
        expect(body).to.have.property('success');
        expect(body.success).to.equal(true);
      });
  });

  it('Should ensure that the user must send "status" and "action" field.', async() => {
    const paymentInstructionId = 12;
    const requestBody = {};
    PaymentsLogServiceMock.alterPaymentInstructionStatus(paymentInstructionId, requestBody);

    await supertest(expressApp)
      .put(`/api/payment-instructions/${paymentInstructionId}`)
      .send(requestBody)
      .expect(res => {
        const { body } = res;

        expect(body).to.have.property('success');
        expect(body).to.have.property('message');
        expect(body.success).to.equal(false);
        expect(body.message).to.equal('Please ensure you send the correct parameters.');
      });
  });

  it('Should ensure that if a query titled "format" is included, then it should either be "JSON" or "CSV".', async() => {
    await supertest(expressApp)
      .get('/api/payment-instructions?format=test')
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(res => {
        const { body } = res;

        expect(body).to.have.property('success');
        expect(body).to.have.property('message');
        expect(body.success).to.equal(false);
        expect(body.message).to.equal('Invalid parameters for format.');
      });
  });

  it('Should not allow a case fee id that is not an integer', async() => {
    const caseFeeId = 'An-invalid-caseFeeId';
    await supertest(expressApp)
      .delete(`/api/fees/${caseFeeId}`)
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(res => {
        const { body } = res;

        expect(body).to.have.property('success');
        expect(body).to.have.property('message');
        expect(body.success).to.equal(false);
        expect(body.message).to.equal('Case Fee ID must be a number');
      });
  });
});
