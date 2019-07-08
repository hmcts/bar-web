const request = require('superagent');
const config = require('config');
const { constants } = require('../../infrastructure/security');
const httpStatusCodes = require('http-status-codes');
const URL = require('url');

class AuthController {
  invalidateToken(req, res) {
    const url = URL.parse(`${config.idam.api_url}/session/${req.cookies[constants.SECURITY_COOKIE]}`, true);
    res.clearCookie(constants.SECURITY_COOKIE);
    return request.delete(url.format())
      .auth(config.idam.client_id, config.idam.client_secret)
      .then(() => {
        res.status(httpStatusCodes.OK).send();
      })
      .catch(err => {
        res.status(httpStatusCodes.BAD_REQUEST).send(err);
      });
  }
}

const authController = new AuthController();

module.exports = authController;