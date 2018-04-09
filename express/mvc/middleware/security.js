const security = require('../../infrastructure/security-factory');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  checkPermission: (req, res, next) => {
    security.protect();
  }
};