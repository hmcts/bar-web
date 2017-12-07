const validator = require( 'validator' ); // https://github.com/chriso/validator.js

module.exports = {
  addPaymentMiddleware: ( req, res, next ) => {
    next();
  },

  validateIdForPayment: ( req, res, next ) => {
    if ( !validator.isInt( req.params.id ) ) {
      res.status( 404 ).json({ success: false, message: 'ID must be a number' });
      return;
    }
    next();
  }
};
