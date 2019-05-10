// require modules
const chai = require('chai'),
  mocha = require('mocha');
const SitesService = require('../../services/SitesService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

// start tests
describe('Test: SitesService', () => {
  let req = {}, res = {};
  beforeEach(() => {
    req = { query: {}, params: { email: 'mock@email.com' } };
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

  it('get sites from the server', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const sitesService = new SitesService(makeHttpRequest);
    const respPromise = await sitesService.getSites(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/sites/users/mock@email.com');
    expect(respPromise.method).to.equal('GET');
  });
});
