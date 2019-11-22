const chai = require('chai'),
  mocha = require('mocha'),
  sinon = require('sinon');
const PaymentsOverviewController = require('../../../mvc/controllers/PaymentsOverviewController');

const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect;

let paymentsOverviewController = null;
const req = {};
const res = {};
paymentsOverviewController = new PaymentsOverviewController();
const getOverviewsStub = sinon.stub(paymentsOverviewController.paymentsOverviewService, 'getOverviews');
const getPiStatsOverviewsStub = sinon.stub(paymentsOverviewController.paymentsOverviewService, 'getPiStatsOverviews');
const getRecordedDataStub = sinon.stub(paymentsOverviewController.paymentsOverviewService, 'getRecordedData');

describe('Test: PaymentsOverviewController', () => {
  it('test indexAction when success', done => {
    getOverviewsStub.callsFake(() => Promise.resolve({ body: 'resolved' }));
    paymentsOverviewController.response = (resp, data) => {
      expect(resp).to.equal(res);
      expect(data).to.equal('resolved');
      done();
    };
    // eslint-disable-next-line
    const next = () => {};
    paymentsOverviewController.indexAction(req, res, next);
  });

  it('test indexAction when error', done => {
    getOverviewsStub.callsFake(() => Promise.reject(new Error('rejected')));
    const next = params => {
      expect(params.message).to.equal('rejected');
      done();
    };
    paymentsOverviewController.indexAction(req, res, next);
  });

  it('test piStatsOverview when success', done => {
    getPiStatsOverviewsStub.callsFake(() => Promise.resolve({ body: 'resolved' }));
    paymentsOverviewController.response = (resp, data) => {
      expect(resp).to.equal(res);
      expect(data).to.equal('resolved');
      done();
    };
    // eslint-disable-next-line
    const next = () => {};
    paymentsOverviewController.piStatsOverview(req, res, next);
  });

  it('test piStatsOverview when error', done => {
    getPiStatsOverviewsStub.callsFake(() => Promise.reject(new Error('rejected')));
    const next = params => {
      expect(params.message).to.equal('rejected');
      done();
    };
    paymentsOverviewController.piStatsOverview(req, res, next);
  });

  it('test piRecordedData when success', done => {
    getRecordedDataStub.callsFake(() => Promise.resolve({ body: 'resolved' }));
    paymentsOverviewController.response = (resp, data) => {
      expect(resp).to.equal(res);
      expect(data).to.equal('resolved');
      done();
    };
    // eslint-disable-next-line
    const next = () => {};
    paymentsOverviewController.piRecordedData(req, res, next);
  });

  it('test piRecordedData when error', done => {
    getRecordedDataStub.callsFake(() => Promise.reject(new Error('rejected')));
    const next = params => {
      expect(params.message).to.equal('rejected');
      done();
    };
    paymentsOverviewController.piRecordedData(req, res, next);
  });
});