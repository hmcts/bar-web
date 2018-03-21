const app = require('./server').app,
  config = require('config'),
  defaultPort = 3000,
  securePort = config.get('bar.securePort'),
  port = process.env.PORT || defaultPort,
  http = require('http'),
  https = require('https');

http.createServer(app).listen(port);

// only needed for https
https.createServer({
  key: '',
  cert: ''
}, app).listen(securePort);
// initialize the express app on the designated port
// @TODO - Add logging (to indicate that this server is actually running)
