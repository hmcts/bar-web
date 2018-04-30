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
  .patch('/payment-instructions/:id', middleware.payments.validateRequestBodyForStatusChange, controllers.paymentsLogController.patchIndex)

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
  .get('/fees/search', middleware.fees.validateFeeController, controllers.feesController.indexAction)

  // Get all payment instructions recorded based on the userId
  .get('/users/:id/payment-instructions', middleware.payments.validateIdForPayment, controllers.paymentInstructionController.indexAction)

  .get('/payments-overview', (req, res) => res.json({
    'bar-post-clerk': {
      365750: [
        {
          bar_user_role: 'bar-post-clerk',
          bar_user_full_name: 'Chris Spencer',
          bar_user_id: '365750',
          count_of_payment_instruction: 6,
          payment_instruction_status: 'P'
        },
        {
          bar_user_role: 'bar-post-clerk',
          bar_user_full_name: 'Chris Spencer',
          bar_user_id: '365750',
          count_of_payment_instruction: 20,
          payment_instruction_status: 'D'
        }
      ],
      365755: [
        {
          bar_user_role: 'bar-post-clerk',
          bar_user_full_name: 'TestPC User',
          bar_user_id: '365755',
          count_of_payment_instruction: 2,
          payment_instruction_status: 'P'
        },
        {
          bar_user_role: 'bar-post-clerk',
          bar_user_full_name: 'TestPC User',
          bar_user_id: '365755',
          count_of_payment_instruction: 2,
          payment_instruction_status: 'D'
        }
      ]
    },
    'bar-fee-clerk': {
      365751: [
        {
          bar_user_role: 'bar-fee-clerk',
          bar_user_full_name: 'Karen Taylor',
          bar_user_id: '365751',
          count_of_payment_instruction: 5,
          payment_instruction_status: 'V'
        },
        {
          bar_user_role: 'bar-fee-clerk',
          bar_user_full_name: 'Karen Taylor',
          bar_user_id: '365751',
          count_of_payment_instruction: 4,
          payment_instruction_status: 'PA'
        }
      ],
      365754: [
        {
          bar_user_role: 'bar-fee-clerk',
          bar_user_full_name: 'Test User',
          bar_user_id: '365754',
          count_of_payment_instruction: 2,
          payment_instruction_status: 'PA'
        },
        {
          bar_user_role: 'bar-fee-clerk',
          bar_user_full_name: 'Test User',
          bar_user_id: '365754',
          count_of_payment_instruction: 2,
          payment_instruction_status: 'V'
        }
      ]
    }
  }));
