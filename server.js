const path = require('path');
const express = require('express');
const check = require('./health-check');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const roles = require('./express/infrastructure/roles');
const csurf = require('csurf');
const HttpStatus = require('http-status-codes');
const route = require('./express/app');
const moment = require('moment');
const { Logger } = require('@hmcts/nodejs-logging');
const httpStatusCodes = require('http-status-codes');

let csrfProtection = csurf({ cookie: true });

if (process.env.NODE_ENV === 'development') {
  csrfProtection = (req, res, next) => {
    next();
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  err.status = err.status || (err.body ? err.body.status || httpStatusCodes.INTERNAL_SERVER_ERROR : httpStatusCodes.INTERNAL_SERVER_ERROR);
  Logger.getLogger(`BAR-WEB: ${err.fileName || 'server.js'}`).error(err.body || err.toString());
  if (req.xhr) {
    res.status(err.status).send(err.remoteError || err.body || err);
  } else {
    res.status(err.status);
    res.render('error', {
      title: err.title || err.status,
      message: err.detailedMessage || err.message,
      msg: err.toString(),
      moment
    });
  }
}

module.exports = (security, appInsights) => {
  const client = appInsights.defaultClient;
  const startTime = Date.now();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json - REMOVE THIS! https://expressjs.com/en/changelog/4x.html#4.16.0
  app.use(bodyParser.json());
  app.use(cookieParser());

  // use helmet for security
  app.use(helmet());
  app.use(helmet.noCache());
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'express/mvc/views'));

  app.use('/logout', security.logout());
  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use('/health/**', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health', check);

  // allow access origin
  // @TODO - This will only take effect when on "dev" environment, but not on "prod"
  if (process.env.NODE_ENV === 'development') {
    app.use('/api', (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth-Dev, CSRF-Token');
      next();
    });
  }

  // make all routes available via this imported module
  app.use('/api', security.protectWithAnyOf(roles.allRoles, ['/payment-types']), csrfProtection, route(appInsights));

  // enable the dist folder to be accessed statically
  app.use(security.protectWithAnyOf(roles.allRoles, ['/assets/']), express.static('dist'));

  // fallback to this route (so that Angular will handle all routing)
  app.get('**', security.protectWithAnyOf(roles.allRoles, ['/assets/']), csrfProtection,
    (req, res) => {
      res.render('index', { csrfToken: req.csrfToken() });
    });

  app.use(errorHandler);

  const duration = Date.now() - startTime;

  client.trackEvent({ name: 'my custom event', properties: { customProperty: 'custom property value' } });
  client.trackException({ exception: new Error('handled exceptions can be logged with this method') });
  client.trackMetric({ name: 'custom metric', value: 3 });
  client.trackTrace({ message: 'trace message' });
  client.trackMetric({ name: 'server startup time', value: duration });

  return app;
};
