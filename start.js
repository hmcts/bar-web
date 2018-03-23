const app = require('./server').app,
  config = require('config'),
  defaultPort = 3000,
  securePort = config.get('node.server.port'),
  crtLocation = config.get('ssl.crt-location'),
  keyLocation = config.get('ssl.key-location'),
  port = process.env.PORT || defaultPort,
  http = require('http'),
  https = require('https');

const key = fs.readFileSync(ctrLocation);
const cert = fs.readFileSync(keyLocation);


https.createServer({
  key: key,
  cert: cert
}, app).listen(securePort);
// initialize the express app on the designated port
// @TODO - Add logging (to indicate that this server is actually running)
