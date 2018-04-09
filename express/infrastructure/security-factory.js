const Security = require('./security').Security;
const config = require('config');

const security = new Security({
  clientId: config.idam.client_id,
  clientSecret: config.idam.client_secret,
  loginUrl: config.idam.login_url,
  registrationUrl: config.idam.registration_url,
  apiUrl: config.idam.api_url,
  redirectUri: '/oauth2/callback'
});

module.exports = security;