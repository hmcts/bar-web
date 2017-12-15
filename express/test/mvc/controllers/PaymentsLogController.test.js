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

  // ensure we get payment types
  it('Should retrieve the rest of the fee log.', async() => {
    PaymentsLogServiceMock.getPaymentsLog();

    await supertest(expressApp)
      .get('/api/payments-instructions')
      .expect(httpStatusCodes.OK)
      .expect(res => {
        const body = res.body;
        expect(body).to.have.property('success');
        expect(body.success).to.eqls(true);
        expect(body.data).to.be.an('array');
      });
  });
});
