const validator = require('validator'); // https://github.com/chriso/validator.js

// Validation for post data request body
exports.ValidatePostMiddleware = (req, res, next) => {
  next()
};
