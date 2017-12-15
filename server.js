const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// enable the dist folder to be accessed statically
app.use(express.static('dist'));

// parse application/json
app.use(bodyParser.json());

// use helmet for security
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());

// allow access origin
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// make all routes available via this imported module
app.use('/api', require('./express/app'));

// fallback to this route (so that Angular will handle all routing)
app.get('**', (req, res) => {
  const distDirectory = path.join(__dirname, 'dist');
  return res.sendFile(`${distDirectory}/index.html`);
});

module.exports = { app };