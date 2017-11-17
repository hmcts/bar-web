const path = require('path');
const express = require('express');
const router = express.Router();

const controllers = require('./mvc/controllers');
const validators = require('./mvc/controllers/validators');

// Payment Routes
router.get(
  '/payment-types',
  controllers.paymentTypes.GET_index
);

router.post(
  '/payments',
  validators.payment.ValidatePostMiddleware,
  controllers.paymentTypes.POST_index
);

module.exports = router;
