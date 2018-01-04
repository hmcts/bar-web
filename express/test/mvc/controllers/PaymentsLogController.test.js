// require modules
const chai = require('chai'),
  httpStatusCodes = require('http-status-codes'),
  mocha = require('mocha'),
  supertest = require('supertest');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  afterEach = mocha.afterEach,
  beforeEach = mocha.beforeEach;

// get classes / modules that'll be tested
const app = require('../../../../server').app;

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

  // ensure we get payment logs
  it('Should retrieve all the payment logs.', async() => {
    PaymentsLogServiceMock.getPaymentsLog();

    await supertest(expressApp)
      .get('/api/payments-instructions')
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

  it('Should successfully create a new case-reference.', async() => {
    const paymentId = 1;
    const data = { case_reference: 1234567890 };
    PaymentsLogServiceMock.createCaseNumber(paymentId, data);

    await supertest(expressApp)
      .post(`/api/payment-instructions/${paymentId}/cases`, data)
      .expect(httpStatusCodes.CREATED)
      .expect(res => {
        const { body } = res;

        // ...the data expected back should been successful
        expect(body).to.have.property('success');
        expect(body.success).to.eqls(true);
        expect(body).to.have.property('data');
        expect(body.data.case_references).to.be.an('array');
        expect(body.data.case_references).to.not.be.empty();
      });
  });
});
