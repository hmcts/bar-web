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
    req = { query: {}, params: { email: 'mock@email.com', siteId: 'Y431' } };
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
    expect(respPromise.uri).to.equal('http://localhost:8080/sites');
    expect(respPromise.method).to.equal('GET');
  });

  it('get site info from the server', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const sitesService = new SitesService(makeHttpRequest);
    const respPromise = await sitesService.getSite(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/sites/Y431/users');
    expect(respPromise.method).to.equal('GET');
  });

  it('add user to a site', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const sitesService = new SitesService(makeHttpRequest);
    const respPromise = await sitesService.addUserToSite(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/sites/Y431/users/mock@email.com');
    expect(respPromise.method).to.equal('POST');
  });

  it('delete user from a site', async() => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const sitesService = new SitesService(makeHttpRequest);
    const respPromise = await sitesService.removeUserFromSite(req);
    expect(respPromise.uri).to.equal('http://localhost:8080/sites/Y431/users/mock@email.com');
    expect(respPromise.method).to.equal('DELETE');
  });


  it('test query string creation', () => {
    const makeHttpRequest = opts => Promise.resolve(opts);
    const sitesService = new SitesService(makeHttpRequest);
    let query = { 'my-sites': true };
    expect(sitesService.createQueryString(query)).to.equal('?my-sites=true');
    query = { 'my-sites': true, 'something-else': 'value' };
    expect(sitesService.createQueryString(query)).to.equal('?my-sites=true&something-else=value');
    query = {};
    expect(sitesService.createQueryString(query)).to.equal('');
    query = '';
    expect(sitesService.createQueryString(query)).to.equal('');
    query = null;
    expect(sitesService.createQueryString(query)).to.equal('');
  });
});
