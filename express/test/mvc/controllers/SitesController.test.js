// require modules
const chai = require('chai'),
  mocha = require('mocha');
const SitesController = require('../../../mvc/controllers/SitesController');
const httpStatusCodes = require('http-status-codes');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

let sitesService = null;
let sitesController = null;
let req = {}, res = {};

// start tests
describe('Test: SitesController', () => {
  beforeEach(() => {
    sitesService = {};
    sitesController = new SitesController(sitesService);
    req = { query: { code: '' }, params: { email: 'mock@email.com' } };
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

  it('Test getSites: success', async() => {
    const respData = { body: [{ id: 'Y431', description: 'BROMLEY COUNTY COURT', email: [] }] };

    sitesService.getSites = () => Promise.resolve(respData);
    await sitesController.getSites(req, res);
    expect(res.respMessage).to.equal(respData.body);
  });

  it('Test getSites: failed', async() => {
    sitesService.getSites = () => Promise.reject(new Error('something bad happened'));
    await sitesController.getSites(req, res);
    expect(res.statusCode).to.equal(httpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.errorMessage.error).to.equal('Error: something bad happened');
  });
});