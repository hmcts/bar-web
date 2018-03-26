const app = require('./server').app,
  fs = require('fs'),
  path = require('path'),
  config = require('config'),
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  defaultPort = 3000,
  port = process.env.PORT || defaultPort,
  https = require('https');

const key = fs.readFileSync(path.join(__dirname, keyLocation));
const cert = fs.readFileSync(path.join(__dirname, crtLocation));

https.createServer({
  key,
  cert
}, app).listen(port);

