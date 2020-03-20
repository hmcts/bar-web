const Security = require('./security').Security;
const config = require('config');

const security = appInsights =>
  new Security({
    clientId: config.idam.client_id,
    clientSecret: config.idam.client_secret,
    webUrl: config.idam.web_url,
    loginUrl: config.idam.login_url,
    registrationUrl: config.idam.registration_url,
    apiUrl: config.idam.api_url,
    redirectUri: '/oauth2/callback',
    appInsights,
    siteRequestUrl: config.site_api.url
  });

module.exports = security;
