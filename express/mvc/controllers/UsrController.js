const security = require('../../infrastructure/security-factory');

class UsrController {
  getUserDetails(req, res) {
    return security.collectUserDetails(req, res);
  }
}

module.exports = UsrController;