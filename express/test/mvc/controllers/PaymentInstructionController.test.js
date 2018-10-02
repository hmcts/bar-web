// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  httpStatusCodes = require('http-status-codes'),
  mocha = require('mocha'),
  supertest = require('supertest');
const security = require('../../../infrastructure/security-factory.mock.js');
const appInsights = require('../../app_insights/appinsights');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach,
  before = mocha.before,
  after = mocha.after;

// get classes / modules that'll be tested
const app = require('../../../../server')(security, appInsights);

const testingPort = 9001;
let expressApp = null;

let PaymentsInstructionServiceMock = null;
const PaymentsInstructionService = require('../../services/PaymentInstructionService.mock');

// start tests
describe('Test: PaymentInstructionController', () => {
  before(async() => {
    expressApp = await app.listen(testingPort);
  });

  after(async() => {
    await expressApp.close();
  });

  beforeEach(() => {
    PaymentsInstructionServiceMock = new PaymentsInstructionService();
  });

  it('It should retrieve all the payment instructions based on IDAM user.', async() => {
    const userId = 12345;
    PaymentsInstructionServiceMock.getByIdamId(userId);

    await supertest(expressApp)
      .get(`/api/users/${userId}/payment-instructions`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('data');
        expect(body).to.have.property('success');
        expect(body.success).to.equal(true);

        // test to ensure that each of the payment instructions were created by the userId
        const containsUserId = paymentInstruction => (paymentInstruction.user_id === userId);
        expect(body.data.every(containsUserId)).to.equal(true);
      });
  });

  it('get payment instruction statistics bt user', async() => {
    const userId = 12345;
    PaymentsInstructionServiceMock.getStats(userId, { status: 'PA' });

    await supertest(expressApp)
      .get(`/api/users/${userId}/payment-instructions/stats?status=PA`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('data');
        expect(body).to.have.property('success');
        expect(body.success).to.equal(true);

        // test to ensure that each of the payment instructions were created by the userId
        const containsUserId = paymentInstruction => (paymentInstruction.user_id === userId);
        expect(body.data.every(containsUserId)).to.equal(true);
      });
  });

  it('send payment instructions to payhub', async() => {
    const timestamp = '1537285689806';
    PaymentsInstructionServiceMock.sendToPayhub(timestamp);

    await supertest(expressApp)
      .get(`/api/payment-instructions/send-to-payhub/${timestamp}`)
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('total');
        expect(body).to.have.property('success');
      });
  });

  it('send payment instructions to payhub when feature is off', async() => {
    const timestamp = '1537285689805';
    PaymentsInstructionServiceMock.sendToPayhub(timestamp);

    await supertest(expressApp)
      .get(`/api/payment-instructions/send-to-payhub/${timestamp}`)
      .expect(httpStatusCodes.BAD_REQUEST)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('message');
        expect(body.message).to.equal('This function is temporarily unavailable.');
      });
  });

  it('reject payment instruction', async() => {
    const id = 1;
    PaymentsInstructionServiceMock.rejectPaymentInstruction(id);

    await supertest(expressApp)
      .patch(`/api/reject-payment-instruction/${id}`)
      .expect(httpStatusCodes.OK);
  });

  it('error when try to rejecting a payment instruction', async() => {
    const id = 2;
    PaymentsInstructionServiceMock.rejectPaymentInstruction(id);

    await supertest(expressApp)
      .patch(`/api/reject-payment-instruction/${id}`)
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .expect(res => {
        const { body } = res;
        expect(body).to.have.property('data');
        expect(body).to.have.property('success');
        expect(body.success).to.equal(false);
        expect(body.data.message).to.equal('payment instruction for id=2 was not found');
      });
  });
});
