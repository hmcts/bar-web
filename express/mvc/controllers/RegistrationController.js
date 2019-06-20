
const requestPromise = require('client-request/promise');
const config = require('config');
const encodeForm = require('form-urlencoded').default;
const httpStatusCodes = require('http-status-codes');

const BASE36 = 36;
const PWD_LENGTH = 10;

class RegistrationController {
  getCode(req) {
    const form = {
      response_type: 'code',
      scope: 'create-user',
      client_id: config.idam.client_id,
      redirect_uri: this.getRedirectUri(req)
    };
    const options = {
      uri: `${config.idam.api_url}/oauth2/authorize`,
      method: 'POST',
      headers: {
        authorization: this.base64encode('`${req.body.username}:${req.body.password}`'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: encodeForm(form)
    };
    return requestPromise(options)
      .then(result => JSON.parse(result.body.toString()).code);
  }

  getToken(req, code) {
    const form = {
      code,
      redirect_uri: this.getRedirectUri(req),
      client_id: config.idam.client_id,
      client_secret: config.idam.client_secret,
      grant_type: 'authorization_code'
    };
    const options = {
      uri: `${config.idam.api_url}/oauth2/token`,
      method: 'POST',
      headers: {
        authorization: this.base64encode('`${config.idam.client_id}:${config.idam.client_secret}`'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: encodeForm(form)
    };
    return requestPromise(options)
      .then(result => JSON.parse(result.body.toString()).access_token);
  }

  async registerUser(req, res) {
    try {
      const code = await this.getCode(req);
      const token = await this.getToken(req, code);
      const options = {
        uri: `${config.idam.api_url}/user/registration`,
        authorization: `Bearer ${token}`,
        body: {
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: this.generatePassword(),
          roles: [req.body.role],
          services: ['BAR']
        }
      };
      const response = await requestPromise(options);
      console.log(response);
      res.status(httpStatusCodes.ACCEPTED).send('success');
    } catch (ex) {
      console.log(ex);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send('failed');
    }
  }

  getRedirectUri(req) {
    return `${req.protocol}://${req.get('host')}/oauth2/callback`;
  }

  base64encode(str) {
    const buff = Buffer.from(str);
    return buff.toString('base64');
  }

  generatePassword() {
    return Math
      .random()
      .toString(BASE36)
      .slice(-PWD_LENGTH);
  }
}

module.exports = RegistrationController;
