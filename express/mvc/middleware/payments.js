const validator = require('validator'); // https://github.com/chriso/validator.js

module.exports = {
	// Validation for post data request body
	AddPaymentMiddleware: (req, res, next) => {
		next();
	},

	ValidateIdForPayment: (req, res, next) => {
		if (!validator.isInt(req.params.id)) {
			res.status(404).json({ success: false, message: 'ID must be a number' });
			return;
		}
		next();
	}
};
