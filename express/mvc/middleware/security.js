const security = require('../../infrastructure/security-factory');

module.exports = {
  checkPermission: (req, res, next) => {
    security.protect();
  }
};