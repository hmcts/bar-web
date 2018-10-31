// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai');
const mocha = require('mocha');
const { isUndefined } = require('lodash');
const FeeController = require('../../../mvc/controllers/FeeController');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

let feeService = null;
const utilService = null;
let feeController = null;
let req = {}, res = {};

// start tests
describe('Test: FeeController', () => {
  beforeEach(() => {
    feeService = {};

    feeController = new FeeController({ feeService, utilService });
    req = { query: { code: '' }, params: {} };
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

  it('Test indexAction: success', async() => {
    feeService.getFees = () => Promise.resolve({ body: 'something' });
    await feeController.indexAction(req, res);

    expect(res.respMessage).to.have.property('found');
    expect(res.respMessage).to.have.property('fees');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.fees).to.equal('something');
  });

  it('Test delete action: success', async() => {
    req.params.case_fee_id = 3;
    feeService.removeFeeFromPaymentInstruction = () => Promise.resolve({});
    await feeController.deleteAction(req, res);

    expect(res.respMessage).to.have.property('message');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.message).to.equal('Successfully removed Case Fee Id');
  });

  it('Search for fee', async() => {
    feeService.searchForFee = () => Promise.resolve({ body: 'something' });
    await feeController.searchForFee(req, res);

    expect(res.respMessage).to.have.property('found');
    expect(res.respMessage).to.have.property('fees');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.fees).to.equal('something');
  });

  it('Search for fee failed', async() => {
    feeService.searchForFee = () => Promise.reject(new Error('failed'));
    await feeController.searchForFee(req, res);
    expect(res.respMessage).not.to.have.property('found');
    expect(res.respMessage).not.to.have.property('fees');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(false);
    expect(res.respMessage).to.have.property('err');
  });

  it('Should have get jurisdiction as a property', () => {
    expect(!isUndefined(feeController.getJurisdictions)).to.equal(true);
  });

  it('Should return the right correct details.', async() => {
    feeService.getJurisdictions = () => Promise.resolve({ body: [] });
    await feeController.getJurisdictions(req, res);
    expect(res.respMessage).to.have.property('found');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage).to.have.property('jurisdictions');
    expect(res.respMessage.jurisdictions).to.be.an('array').and.to.have.lengthOf(0);
  });

  it('should ensure error is caught.', async() => {
    feeService.getJurisdictions = () => Promise.reject(new Error({ err: 'Unable to retrieve jurisdictions', success: false }));
    await feeController.getJurisdictions(req, res);
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(false);
    expect(res.respMessage).to.have.property('err');
  });
});
