const isInt = require( 'validator/lib/isInt' ); // https://github.com/chriso/validator.js

module.exports = {
  addPaymentMiddleware: ( req, res, next ) => {
    next();
  },

  validateIdForPayment: ( req, res, next ) => {
    if ( !isInt( req.params.id ) ) {
      res.status( 404 ).json({ success: false, message: 'ID must be a number' });
      return;
    }
    next();
  }
};
