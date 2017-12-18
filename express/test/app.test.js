// require modules
const httpStatusCodes = require('http-status-codes'),
  mocha = require('mocha'),
  supertest = require('supertest');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  afterEach = mocha.afterEach,
  beforeEach = mocha.beforeEach;

// get classes / modules that'll be tested
const app = require('../../server').app;

const testingPort = 9001;
let expressApp = null;

// start tests
describe('Test: Express Application', () => {
  beforeEach(done => {
    expressApp = app.listen(testingPort, done);
  });

  afterEach(done => {
    expressApp.close(done);
  });

  // ensure we get payment types
  it('Should get API response.', async() => {
    await supertest(app)
      .get('/api/payment-types')
      .expect(httpStatusCodes.OK);
  });
});