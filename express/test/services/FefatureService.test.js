// require modules
const chai = require('chai'),
  mocha = require('mocha');
const FeatureService = require('../../services/FeatureService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

const payload = {
  uid: 'payment-actions-action',
  enable: true,
  description: 'Available actions for payment',
  group: null,
  permissions: [],
  flippingStrategy: null,
  customProperties: {}
};

// start tests
describe('Test: FeatureService', () => {
  let req = {}, res = {};
  beforeEach(() => {
    req = { query: {}, params: {} };
    res = {
      statusCode: '',
      respMessage: {},
      status: code => {
        res.statusCode = code;
        return res;
      },
      json: message => {
        res.respMessage = message;
      }
    };
  });

  it('get features from the server', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const featureService = new FeatureService(makeHttpRequest);
    const respPromise = await featureService.getFeatures(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/api/ff4j/store/features');
    expect(respPromise.method).to.equal('GET');
  });

  it('update a feature', async() => {
    req.body = payload;
    req.params.feat_uid = payload.uid;
    const makeHttpRequest = opts => Promise.resolve(opts);
    const featureService = new FeatureService(makeHttpRequest);
    const respPromise = await featureService.updateFeature(req.params.feat_uid, req);
    expect(respPromise.uri).to.equal(`http://localhost:8080/api/ff4j/store/features/${payload.uid}`);
    expect(respPromise.method).to.equal('PUT');
  });
});