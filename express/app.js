const path = require('path');
const express = require('express');

const Controllers = require('./mvc/controllers');
const Middleware = require('./mvc/middleware');

module.exports = express.Router()
	.get('/payment-types', Controllers.PaymentsController.get_index) // Payment Routes
	.get('/paymentsLog', Controllers.PaymentsLogController.get_index) // Payments Log Routes
	.post('/payments/:type', Middleware.Payments.AddPaymentMiddleware, Controllers.PaymentsController.post_index);
