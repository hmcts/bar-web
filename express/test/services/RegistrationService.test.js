const chai = require('chai'),
  mocha = require('mocha');
const RegistrationService = require('../../services/RegistrationService');

// get test libraries etc
const describe = mocha.describe,
  it = mocha.it,
  expect = chai.expect,
  beforeEach = mocha.beforeEach;

describe('Test: RegistrationService', () => {
  let req = {}, res = {};

  beforeEach(() => {
    req = {
      authToken: 'ThisIsTheAuthToken',
      body: {
        email: 'a@z.com',
        lastName: 'A',
        firstName: 'B',
        roles: ['bar-fee-clerk']
      }
    };
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

  it('test call RegistrationService.registerUser() when feature is on', async() => {
    const featureService = {
      getFeatures: () =>
        Promise.resolve({
          body: [
            {
              uid: 'register-user-idam',
              enable: true
            }
          ]
        })
    };
    const registrationService = new RegistrationService(featureService);
    let reqToIdam = null;
    registrationService.requestPromise = options => {
      reqToIdam = options.body;
      return Promise.resolve('user registered');
    };
    const response = await registrationService.registerUser(req);
    expect(response).to.equal('user registered');
    expect(reqToIdam.lastName).to.equal('A');
    expect(reqToIdam.firstName).to.equal('B');
    expect(reqToIdam.email).to.equal('a@z.com');
  });

  it('test call RegistrationService.registerUser() when registration is failing', async() => {
    const featureService = {
      getFeatures: () =>
        Promise.resolve({
          body: [
            {
              uid: 'register-user-idam',
              enable: true
            }
          ]
        })
    };
    const registrationService = new RegistrationService(featureService);
    registrationService.requestPromise = () => Promise.reject(new Error('failed to register the user'));
    try {
      await registrationService.registerUser(req);
    } catch (e) {
      expect(e.message).to.equal('failed to register the user');
    }
  });

  it('test call RegistrationService.registerUser() when feature is off', async() => {
    const featureService = {
      getFeatures: () =>
        Promise.resolve({
          body: [
            {
              uid: 'some-other-feature',
              enable: true
            }
          ]
        })
    };
    const registrationService = new RegistrationService(featureService);
    const response = await registrationService.registerUser(req);
    expect(response).to.equal('registration is switched off');
  });
});