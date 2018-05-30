// process.env.NODE_ENV = 'test';

// require modules
const chai = require('chai'),
  mocha = require('mocha');
const FeeController = require('../../../mvc/controllers/FeeController');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

let feeService = null;
let feeController = null;
let req = {}, res = {};

// start tests
describe('Test: FeeController', () => {
  beforeEach(() => {
    feeService = {};
    feeController = new FeeController();
    feeController.feeService = feeService;
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
    // console.log(res);
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
    // console.log(res);
    expect(res.respMessage).to.have.property('message');
    expect(res.respMessage).to.have.property('success');
    expect(res.respMessage.success).to.equal(true);
    expect(res.respMessage.message).to.equal('Successfully removed Case Fee Id');
  });
});
