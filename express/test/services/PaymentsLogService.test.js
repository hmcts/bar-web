// require modules
const chai = require('chai'),
  mocha = require('mocha'),
  nock = require('nock'),
  path = require('path'),
  supertest = require('supertest');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect;

const FeeLogMock = require('./PaymentsLogService.mock');

// start tests
describe('Test: FeeLogService', () => {
  afterEach(() => {});
  beforeEach(() => {});

  // ensure we get payment types
  it('Should get API response', () => {
    // chai-for-promise should be used here to check if it's a thenable object returned from feelogmock
    // const feeLogs = FeeLogMock.getFeeLog();
    // console.log( feeLogs );
  });

  it('Should get feelog by id');
});
