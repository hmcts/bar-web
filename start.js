
const app = require('./server').app,
  fs = require('fs'),
  config = require('config'),
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  defaultPort = config.get('bar.defaultPort'),
  port = process.env.PORT || defaultPort,
  https = require('https');

const eol = require('os').EOL;

const crtLocationEol = crtLocation + eol;

const keyLocationEol = keyLocation + eol;

const cert = (process.env.NODE_ENV === 'production') ? crtLocationEol : fs.readFileSync(crtLocation, 'utf-8');
const key = (process.env.NODE_ENV === 'production') ? keyLocationEol : fs.readFileSync(keyLocation, 'utf-8');

https.createServer({ key, cert }, app).listen(port);
