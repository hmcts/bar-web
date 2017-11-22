const path = require('path');
const express = require('express');
const router = express.Router();

const controllers = require('./mvc/controllers');
const validators = require('./mvc/controllers/validators');

// Payment Routes
router.get(
  '/payment-types',
  controllers.payments.GET_index
);

router.post(
  '/payments/:type',
  validators.payment.ValidatePostMiddleware,
  controllers.payments.POST_index
);

module.exports = router;
