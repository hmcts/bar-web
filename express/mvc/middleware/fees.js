const alphaNum = require('validator/lib/isAlphanumeric');
const httpStatusCodes = require('http-status-codes');

module.exports = {

  validateFeeController: (req, res, next) => {
    if (req.query.code !== 'undefined') {
      if (!alphaNum(req.query.code)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Invalid parameters.' });
      }
      next();
    }
  }

}
