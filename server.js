const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const security = require('./express/infrastructure/security-factory');
const cookieParser = require('cookie-parser');

const distDirectory = path.join(__dirname, 'dist');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// enable the dist folder to be accessed statically
app.use(express.static('dist'));
app.use(express.static('data'));

// parse application/json - REMOVE THIS! https://expressjs.com/en/changelog/4x.html#4.16.0
app.use(bodyParser.json());
app.use(cookieParser());

// use helmet for security
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());

app.use('/logout', security.logout());
app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());

// allow access origin
// @TODO - This will only take effect when on "dev" environment, but not on "prod"
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth-Dev');
  next();
});

// make all routes available via this imported module
app.use('/api', security.protectWithAnyOf(['super', 'bar-delivery-manager', 'bar-senior-clerk', 'bar-fee-clerk', 'bar-post-clerk']),
  require('./express/app'));

// fallback to this route (so that Angular will handle all routing)
app.get('**', security.protectWithAnyOf(['super', 'bar-delivery-manager', 'bar-senior-clerk', 'bar-fee-clerk', 'bar-post-clerk']),
  (req, res) => res.sendFile(`${distDirectory}/index.html`));

module.exports = { app };
