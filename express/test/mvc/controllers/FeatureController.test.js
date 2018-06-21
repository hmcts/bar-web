// require modules
const chai = require('chai'),
  mocha = require('mocha');
const FeatureController = require('../../../mvc/controllers/FeatureController');
const httpStatusCodes = require('http-status-codes');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

let featureService = null;
let featureController = null;
let req = {}, res = {};
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
describe('Test: getFeatures', () => {
  beforeEach(() => {
    featureService = {};
    featureController = new FeatureController(featureService);
    req = { query: { code: '' }, params: {} };
    res = {
      errorMessage: '',
      statusCode: '',
      respMessage: {},
      status: code => {
        res.statusCode = code;
        return res;
      },
      json: message => {
        res.respMessage = message;
      },
      send: message => {
        res.errorMessage = message;
      }
    };
  });

  it('Test getFeatures: success', async() => {
    const respData = { body: [payload] };

    featureService.getFeatures = () => Promise.resolve(respData);
    await featureController.getFeatures(req, res);
    expect(res.respMessage).to.equal(respData.body);
  });

  it('Test getFeatures: failed', async() => {
    featureService.getFeatures = () => Promise.reject(new Error('something bad happened'));
    await featureController.getFeatures(req, res);
    expect(res.statusCode).to.equal(httpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.errorMessage.error).to.equal('Error: something bad happened');
  });

  it('Test putFeature: success', async() => {
    req.body = payload;
    req.params.feat_uid = payload.uid;
    featureService.updateFeature = uid => Promise.resolve({ body: uid });
    await featureController.putFeature(req, res);
    expect(res.respMessage).to.equal(payload.uid);
  });
});