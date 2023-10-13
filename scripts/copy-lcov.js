const fs = require('fs-extra');

(function copyLcov() {
  fs.copySync('./coverage/bar-web/lcov.info', './Reset');
}());
