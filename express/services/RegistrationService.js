const config = require('config');
const requestPromise = require('client-request/promise');

class RegistrationService {
  registerUser(req) {
    const token = this.getAccessToken(req);
    const options = {
      uri: `${config.idam.api_url}/user/registration`,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      method: 'POST',
      json: true,
      body: {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        roles: req.body.roles
      }
    };
    return requestPromise(options);
  }

  getAccessToken(req) {
    return req.authToken;
  }
}

const registrationService = new RegistrationService();

module.exports = registrationService;