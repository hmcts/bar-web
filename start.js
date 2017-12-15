const express = require('express'),
  app = require('./server').app;

const defaultPort = 3000,
  port = process.env.PORT || defaultPort;

// initialize the express app on the designated port
// @TODO - Add logging (to indicate that this server is actually running)
app.listen(port);
