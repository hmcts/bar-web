process.env.NODE_ENV = 'test';

// require modules
const path = require('path');
const chai = require('chai');
const mocha = require('mocha');
const httpStatusCodes = require('http-status-codes');
const supertest = require('supertest');
const security = require(`${path.resolve('..', '..', '...', 'infrastructure')}/security-factory.mock.js`);

// get test libraries etc
const { after, before, beforeEach, describe, it } = mocha;
const { expect } = chai;

// get classes / modules that'll be tested
const app = require('../../../../server')(security);

const testingPort = 9001;
let expressApp = null;

let PaymentsInstructionServiceMock = null;
const PaymentsInstructionService = require('../../services/PaymentInstructionService.mock');

describe('Test: PaymentInstructionController', () => {
  before(async() => {
    expressApp = await app.listen(testingPort);
  });

  after(() => expressApp.close());

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
});
