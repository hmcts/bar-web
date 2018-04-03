// require modules
const mocha = require('mocha');

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
  it('Should get payment types.');
});