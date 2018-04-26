const HttpStatusCodes = require('http-status-codes');

class BaseController {
  response(res, data, status = HttpStatusCodes.OK) {
    let success = true;
    if (status >= HttpStatusCodes.BAD_REQUEST) {
      success = false;
    }

    return res.status(status).json({ success, data });
  }
}

module.exports = BaseController;
