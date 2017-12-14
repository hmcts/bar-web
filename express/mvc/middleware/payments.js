// https://github.com/chriso/validator.js
const httpStatusCodes = require('http-status-codes');
const isInt = require('validator/lib/isInt');

module.exports = {
  addPaymentMiddleware: (req, res, next) => {
    next();
  },

  validateIdForPayment: (req, res, next) => {
    if (!isInt(req.params.id)) {
      res.status(httpStatusCodes.NOT_FOUND).json({ success: false, message: 'ID must be a number' });
      return;
    }
    next();
  }
};
