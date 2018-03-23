const app = require('./server').app,
  fs = require('fs'),
  config = require('config'),
  securePort = config.get('node.server.port'),
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  https = require('https');

const key = fs.readFileSync(keyLocation);
const cert = fs.readFileSync(crtLocation);


https.createServer({
  key,
  cert
}, app).listen(securePort);
