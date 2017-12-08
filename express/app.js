const express = require( 'express' );
const controllers = require( './mvc/controllers' );
const middleware = require( './mvc/middleware' );

module.exports = express.Router()
  .get( '/payment-types', controllers.paymentsController.getIndex ) // Payment Routes
  .get( '/payments-log', controllers.paymentsLogController.getIndex ) // Payments Log Routes
  .get( '/payment-instruction/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.getById ) // Get payments by ID
  .delete( '/payment-instruction/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.deleteIndex ) // Get payments by ID
  .post( '/payments/:type', middleware.payments.addPaymentMiddleware, controllers.paymentsController.postIndex ) // send payment information
  .post( '/payment-instructions', controllers.paymentsLogController.postIndex ); // Send pending payments
