const security = require('./express/infrastructure/security-factory');
const app = require('./server')(security),
  config = require('config'),
  fs = require('fs'),
  defaultPort = config.get('bar.defaultPort'),
  port = process.env.PORT || defaultPort,
  https = require('https'),
  http = require('http');

// SSL handled at IIS level so Node.js app (iisnode) should be http only.
if (process.env.IGNORE_CERTS) {
  http.createServer(app).listen(port);
} else {
  const crtLocation = config.get('certs.crt'),
    keyLocation = config.get('certs.key'),
    cert = fs.readFileSync(crtLocation),
    key = fs.readFileSync(keyLocation);
  https.createServer({ key, cert }, app).listen(port);
}
