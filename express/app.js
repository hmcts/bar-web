const express = require('express');
const Controllers = require('./mvc/controllers');
const Middleware = require('./mvc/middleware');

module.exports = express.Router()
	.get('/payment-types', Controllers.PaymentsController.GetIndex) // Payment Routes
	.get('/paymentsLog', Controllers.PaymentsLogController.GetIndex) // Payments Log Routes
	.get('/payment-instructions/:id', Middleware.Payments.ValidateIdForPayment, Controllers.PaymentsLogController.GetById) // Get payments by ID
	.post('/payments/:type', Middleware.Payments.AddPaymentMiddleware, Controllers.PaymentsController.PostIndex) // send payment information
	.post('/payment-instructions', Controllers.PaymentsLogController.PostIndex); // Send pending payments
