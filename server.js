const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const roles = require('./express/infrastructure/roles');

const distDirectory = path.join(__dirname, 'dist');

const HttpStatus = require('http-status-codes');

const route = require('./express/app');

module.exports = security => {
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
  app.use(express.static('data'));

  app.use('/health', (req, res) => {
    res.status(HttpStatus.OK).json({ status: 'UP' });
  });

  // allow access origin
  // @TODO - This will only take effect when on "dev" environment, but not on "prod"
  app.use('/api', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth-Dev');
    next();
  });

  // Restrict access to angular routing paths
  // post-clerk/fee-clerk screens and roles
  app.use('/dashboard', security.protectWithAnyOf([roles.postClerk.roleName, roles.feeClerk.roleName]));
  app.use('/paymentslog', security.protect(roles.postClerk.roleName));
  app.use('/feelog', security.protect(roles.feeClerk.roleName));
  app.use('/check-and-submit', security.protect(roles.feeClerk.roleName));

  // senior-clerk/delivery-manager screens and roles
  app.use('/payment-overview', security.protectWithAnyOf([roles.seniorClerk.roleName, roles.deliveryManager.roleName]));
  app.use('/payment-review', security.protect(roles.seniorClerk.roleName, roles.deliveryManager.roleName));
  app.use('/approved-payments', security.protectWithAnyOf([roles.seniorClerk.roleName, roles.deliveryManager.roleName]));
  app.use('/reporting', security.protectWithAnyOf([roles.seniorClerk.roleName, roles.deliveryManager.roleName]));

  // make all routes available via this imported module
  app.use('/api', security.protectWithAnyOf(roles.allRoles), route);

  // enable the dist folder to be accessed statically
  app.use(security.protectWithAnyOf(roles.allRoles), express.static('dist'));

  // fallback to this route (so that Angular will handle all routing)
  app.get('**', security.protectWithAnyOf(roles.allRoles),
    (req, res) => res.sendFile(`${distDirectory}/index.html`));

  return app;
};
