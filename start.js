
const app = require('./server').app,
  fs = require('fs'),
  config = require('config'),
  crtLocation = config.get('certs.crt'),
  keyLocation = config.get('certs.key'),
  defaultPort = config.get('bar.defaultPort'),
  port = process.env.PORT || defaultPort,
  https = require('https'),
  http = require('http');


const cert = fs.readFileSync(crtLocation);
const key = fs.readFileSync(keyLocation);

https.createServer({ key, cert }, app).listen(port);
// http.createServer(app).listen(port);
