const config = require('config');
const requestPromise = require('client-request/promise');

const BASE36 = 36;
const PWD_LENGTH = 10;

class RegistrationService {
  registerUser(req) {
    const token = this.getAccessToken(req);
    const options = {
      uri: `${config.idam.api_url}/user/registration`,
      authorization: `Bearer ${token}`,
      method: 'POST',
      body: {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: this.generatePassword(),
        roles: req.body.roles,
        services: ['BAR']
      }
    };
    return requestPromise(options);
  }

  getAccessToken(req) {
    return req.authToken;
  }

  generatePassword() {
    return Math
      .random()
      .toString(BASE36)
      .slice(-PWD_LENGTH);
  }
}

const registrationService = new RegistrationService();

module.exports = registrationService;