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
let error = {};

// start tests
describe('Test: SitesController', () => {
  beforeEach(() => {
    sitesService = {};
    sitesController = new SitesController(sitesService);
    req = { query: { code: '' }, params: { email: 'mock@email.com' } };
    res = {
      message: '',
      statusCode: '',
      status: code => {
        res.statusCode = code;
        return res;
      },
      json: message => {
        res.message = message;
      },
      send: message => {
        res.message = message;
      }
    };
    error = new Error('sonething bad happened');
    error.body = {
      error: 'Bad Request',
      message: 'The user with \'A@K\' email already assigned to Y431',
      path: '/sites/Y431/users/a@k',
      status: 400,
      timestamp: '2019-05-13T14:52:00.459+0000'
    };
    error.response = { statusCode: 400 };
  });

  it('Test getSites: success', async() => {
    const respData = {
      body: [{ id: 'Y431', description: 'BROMLEY COUNTY COURT', email: [] }],
      response: { statusCode: httpStatusCodes.OK }
    };

    sitesService.getSites = () => Promise.resolve(respData);
    await sitesController.getSites(req, res);
    expect(res.message).to.equal(respData.body);
  });

  it('Test getSites: failed', async() => {
    sitesService.getSites = () => Promise.reject(error);
    await sitesController.getSites(req, res);
    expect(res.statusCode).to.equal(httpStatusCodes.BAD_REQUEST);
    expect(res.message.error).to.equal('Bad Request');
    expect(res.message.message).to.equal('The user with \'A@K\' email already assigned to Y431');
  });

  it('Test getSite: success', async() => {
    const respData = {
      body: { id: 'Y431', description: 'BROMLEY COUNTY COURT', email: ['a@a', 'b@b', 'c@c'] },
      response: { statusCode: httpStatusCodes.OK }
    };

    sitesService.getSite = () => Promise.resolve(respData);
    await sitesController.getSite(req, res);
    expect(res.message).to.equal(respData.body);
  });

  it('Test getSite: failed', async() => {
    sitesService.getSite = () => Promise.reject(error);
    await sitesController.getSite(req, res);
    expect(res.statusCode).to.equal(httpStatusCodes.BAD_REQUEST);
    expect(res.message.error).to.equal('Bad Request');
    expect(res.message.message).to.equal('The user with \'A@K\' email already assigned to Y431');
  });

  it('Test addUserToSite: success', async() => {
    const respData = {
      body: '',
      response: { statusCode: httpStatusCodes.OK }
    };

    sitesService.addUserToSite = () => Promise.resolve(respData);
    await sitesController.addUserToSite(req, res);
    expect(res.message).to.equal(respData.body);
    expect(res.statusCode).to.equal(respData.response.statusCode);
  });


});