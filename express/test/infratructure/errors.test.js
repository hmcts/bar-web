const mocha = require('mocha');
const chai = require('chai');
const { ApiErrorFactory } = require('../../infrastructure/errors');

const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

describe('errors.js -> test error creation', () => {
  let errorFactory = null;
  const UNATHORIZED = 401;
  beforeEach(() => {
    errorFactory = ApiErrorFactory('errors.test.js');
  });

  it('test creating an internal server error', () => {
    let serverError = errorFactory.createServerError();
    expect(serverError.remoteError).to.be.an('undefined');
    expect(serverError.message).to.equal('500 - Internal Server Error');

    serverError = errorFactory.createServerError({ error: 'something went wrong' });
    expect(serverError.remoteError.error).to.equal('something went wrong');
  });

  it('test forbidden error creation', () => {
    const err = { error: 'this is a serious error' };
    const forbiddenError = errorFactory.createForbiddenError(err, 'My custom error message');
    expect(forbiddenError.message).to.equal('My custom error message');
    expect(forbiddenError.remoteError).to.equal(err);
    expect(forbiddenError.title).to.equal('403 - Forbidden');
    expect(forbiddenError.fileName).to.equal('errors.test.js');
  });

  it('test forbidden error creation', () => {
    const err = { error: 'this is a serious error' };
    const forbiddenError = errorFactory.createUnathorizedError(err);
    expect(forbiddenError.status).to.equal(UNATHORIZED);
    expect(forbiddenError.message).to.equal('401 - Access Denied');
    expect(forbiddenError.remoteError).to.equal(err);
    expect(forbiddenError.title).to.equal('401 - Access Denied');
    expect(forbiddenError.fileName).to.equal('errors.test.js');
  });
});