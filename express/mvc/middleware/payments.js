// https://github.com/chriso/validator.js
const httpStatusCodes = require('http-status-codes');
const isInt = require('validator/lib/isInt');

module.exports = {
  addPaymentMiddleware: (req, res, next) => next(),

  validateStatusType: (req, res, next) => {
    if (!req.query.hasOwnProperty('status')) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'Please include status in request.' });
    }

    return next();
  },

  validateIdForPayment: (req, res, next) => {
    if (req.params.hasOwnProperty('id')) {
      if (!isInt(req.params.id)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'ID must be a number' });
      }
    }

    return next();
  },

  validateRequestBodyForStatusChange: (req, res, next) => {
    if (req.params.hasOwnProperty('id')) {
      if (!isInt(req.params.id)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'ID must be a number' });
      }
    }

    if (!req.body.hasOwnProperty('action') || !req.body.hasOwnProperty('status')) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'Please ensure you send the correct parameters.' });
    }

    return next();
  }
};
