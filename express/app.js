const path = require('path');
const express = require('express');
const router = express.Router();

const controllers = require('./mvc/controllers');
const validators = require('./mvc/middleware');

// Payment Routes
router.get(
  '/payment-types',
  controllers.payments.get_index
);

router.post(
  '/payments/:type',
  validators.payment.ValidatePostMiddleware,
  controllers.payments.post_index
);

module.exports = router;
