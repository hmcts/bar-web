const mocha = require('mocha');
const chai = require('chai');
const security = require('../../infrastructure/security-factory.js');
const appInsights = require('../app_insights/appinsights');

const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect;

describe('test creation of security class', () => {
  it('security-factory should give back an instace of security class', () => {
    expect(security(appInsights).opts.redirectUri).to.equal('/oauth2/callback');
  });
});