const express = require('express');
const controllers = require('./mvc/controllers');
const middleware = require('./mvc/middleware');
const config = require('config');
const HttpStatus = require('http-status-codes');
const authController = require('./mvc/controllers/AuthController');

module.exports = appInsights => express.Router()

  // load payment types
  .get('/payment-types', controllers.paymentsController.getIndex)

  // load payment actions
  .get('/payment-action', controllers.paymentActionController.indexAction)

  // Payments Log Routes
  .get('/payment-instructions', middleware.payments.validateStatusType, controllers.paymentsLogController.getIndex)

  // Send payments to payhub
  .get('/payment-instructions/send-to-payhub/:timestamp', controllers.paymentInstructionController.sendToPayhub)

  // Search Payments Log
  .get('/payment-instructions/search', middleware.payments.validateStatusType, controllers.paymentsLogController.searchIndex)

  // Count
  .get('/payment-instructions/count', controllers.paymentInstructionController.getCount)

  // Get payments by ID
  .get('/payment-instructions/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.getById)

  // Get payments by ID
  .delete('/payment-instructions/:id', middleware.payments.validateIdForPayment, controllers.paymentsLogController.deleteIndex)

  // Responsible for changing status
  .put('/payment-instructions/:id', middleware.payments.validateRequestBodyForStatusChange, controllers.paymentsLogController.putIndex)

  // Add payment case number
  .post('/payment-instructions/:id/cases', controllers.paymentsLogController.postCases)

  // Responsible for adding fees to a case (under payment instruction)
  .post('/payment-instructions/:id/fees', middleware.payments.validateIdForPayment, controllers.feesController.postAddFeeToCase)

  // Responsible for changing fees on a case (under payment instruction)
  .put('/payment-instructions/:id/fees', middleware.payments.validateIdForPayment, controllers.feesController.putModifyFeeToCase)

  // get the unallocated payment
  .get('/payment-instructions/:id/unallocated', middleware.payments.validateIdForPayment, controllers.paymentsController.getUnallocated)

  // send payment information
  .post('/payment/:type', middleware.payments.addPaymentMiddleware, (req, res) => {
    controllers.paymentsController.postIndex(req, res, appInsights);
  })

  // Send pending payments
  .post('/payment-instructions', controllers.paymentsLogController.postIndex)

  // delete fee by "case" fee ID
  .delete('/fees/:case_fee_id', middleware.payments.validateIdForPayment, middleware.payments.validateCaseFeeId, controllers.feesController.deleteAction)

  // dummy api for getting the fee codes
  .get('/fees/search', middleware.fees.validateFeeController, controllers.feesController.searchForFee)

  // api for getting Jurisdictions
  .get('/fees/jurisdictions', controllers.feesController.getJurisdictions)

  .get('/payment-stats', controllers.paymentsOverviewController.indexAction)

  // Get payment instructions stats for user based on different properties
  .get('/users/:id/payment-instructions/stats', controllers.paymentInstructionController.getStats)

  // Get all payment instructions recorded based on the userId
  .get('/users/:id/payment-instructions', controllers.paymentInstructionController.indexAction)

  .get('/users/pi-stats', controllers.paymentsOverviewController.piStatsOverview)

  .get('/features', controllers.featureController.getFeatures)

  .put('/features/:feat_uid', controllers.featureController.putFeature)

  // Get all the sites assigned to the User by email
  .get('/sites', controllers.sitesController.getSites)

  .get('/sites/:siteId/users', controllers.sitesController.getSite)

  .post('/sites/:siteId/users/:email', controllers.sitesController.addUserToSite)

  .delete('/sites/:siteId/users/:email', controllers.sitesController.removeUserFromSite)

  .patch('/reject-payment-instruction/:id', controllers.paymentInstructionController.patchPaymentInstruction)

  .get('/current-time', (req, res) => res.json({ currentTime: Date.now() }))

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }))

  .get('/invalidate-token', (req, res) => authController.invalidateToken(req, res));
