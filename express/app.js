const express = require('express');
const controllers = require('./mvc/controllers');
const middleware = require('./mvc/middleware');

module.exports = express.Router()

// load payment types
  .get('/payment-types', controllers.paymentsController.getIndex)

  // Payments Log Routes
  .get('/payment-instructions', middleware.payments.validateStatusType, controllers.paymentsLogController.getIndex)

  // Search Payments Log
  .get('/payment-instructions/search', middleware.payments.validateStatusType, controllers.paymentsLogController.searchIndex)

  // Get payments by ID
  .get('/payment-instructions/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.getById)

  // Get payments by ID
  .delete('/payment-instructions/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.deleteIndex)

  // Responsible for changing status
  .put('/payment-instructions/:id', middleware.payments.validateRequestBodyForStatusChange, controllers.paymentsLogController.patchIndex)

  // Add payment case number
  .post('/payment-instructions/:id/cases', controllers.paymentsLogController.postCases)

  // Responsible for adding fees to a case (under payment instruction)
  .post('/payment-instructions/:id/fees', middleware.payments.validateIdForPayment, controllers.feesController.postAddFeeToCase)

  // Responsible for changing fees on a case (under payment instruction)
  .put('/payment-instructions/:id/fees', middleware.payments.validateIdForPayment, controllers.feesController.putModifyFeeToCase)

  // get the unallocated payment
  .get('/payment-instructions/:id/unallocated', middleware.payments.validateIdForPayment, controllers.paymentsController.getUnallocated)

  // send payment information
  .post('/payment/:type', middleware.payments.addPaymentMiddleware, controllers.paymentsController.postIndex)

  // Send pending payments
  .post('/payment-instructions', controllers.paymentsLogController.postIndex)

  // delete fee by "case" fee ID
  .delete('/fees/:case_fee_id', middleware.payments.validateIdForPayment, middleware.payments.validateCaseFeeId, controllers.feesController.deleteAction)

  // dummy api for getting the fee codes
  .get('/fees/search', middleware.fees.validateFeeController, controllers.feesController.searchForFee)

  .get('/payment-stats', controllers.paymentsOverviewController.indexAction)

  // Get payment instructions stats for user based on different properties
  .get('/users/:id/payment-instructions/stats', controllers.paymentInstructionController.getStats)

  // Get all payment instructions recorded based on the userId
  .get('/users/:id/payment-instructions', middleware.payments.validateIdForPayment, controllers.paymentInstructionController.indexAction)

  .get('/users/pi-stats', controllers.paymentsOverviewController.piStatsOverview)

  .get('/users/pi-rejected-stats', controllers.paymentsOverviewController.rejectedPIStats)

  .get('/features', controllers.featureController.getFeatures)

  .put('/features/:feat_uid', controllers.featureController.putFeature)

  .patch('/reject-payment-instruction/:id', controllers.paymentInstructionController.patchPaymentInstruction);