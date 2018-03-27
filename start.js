const app = require('./server').app,
  fs = require('fs'),
  path = require('path'),
  config = require('config'),
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  defaultPort = config.get('bar.defaultPort'),
  port = process.env.PORT || defaultPort,
  https = require('https');

const key = fs.readFileSync(path.join(keyLocation));
const cert = fs.readFileSync(path.join(crtLocation));

https.createServer({
  key,
  cert
}, app).listen(port);
