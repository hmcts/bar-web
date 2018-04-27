process.env.NODE_ENV = 'test';

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

let PaymentsInstructionServiceMock = null;
const PaymentsInstructionService = require('../../services/PaymentInstructionService.mock');

// start tests
describe('Test: PaymentInstructionController', () => {
  beforeEach(done => {
    PaymentsInstructionServiceMock = new PaymentsInstructionService();
    expressApp = app.listen(testingPort, done);
  });

  afterEach(done => {
    expressApp.close(done);
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
});
