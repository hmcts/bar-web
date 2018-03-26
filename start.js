const app = require('./server').app,
  fs = require('fs'),
  path = require('path'),
  DEFAULT_PORT = 3000,
  config = require('config'),
  securePort = config.get('server.port') || DEFAULT_PORT,
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  https = require('https');

const key = fs.readFileSync(path.join(__dirname, keyLocation));
const cert = fs.readFileSync(path.join(__dirname, crtLocation));

https.createServer({ key, cert }, app).listen(securePort);

console.log('server started.');
