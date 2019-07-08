const chai = require('chai');
const mocha = require('mocha');
const sinon = require('sinon');
const authController = require('../../../mvc/controllers/AuthController');

const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

const req = { cookies: { '__auth-token': 'some_auth_token' } };
const res = {
  // eslint-disable-next-line no-empty-function
  clearCookie: () => { }
};
let spy = null;

describe('Test: AuthController', () => {
  beforeEach(() => {
    spy = sinon.spy(res, 'clearCookie');
  });

  it('Test invalidate auth token', () => {
    authController.invalidateToken(req, res);
    expect(spy.called).to.equal(true);
  });
});