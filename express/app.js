const path = require('path')
const express = require('express')
const router = express.Router()
const PaymentsMiddleware = require('./validators/payments')
const PaymentService = require('./services/PaymentService')

// Responsible for sending out payment types
const PaymentTypesRoute = async (req, res) => {
  const paymentTypes = await PaymentService.getPaymentTypes()
  res.json(paymentTypes)
}
router.get('/payment-types', PaymentTypesRoute)

// Responsible for handling payments
const PaymentPost = (req, res) => {
    console.log( req.body )
    return res.json(req.body)
}
router.post('/payments', PaymentsMiddleware.ValidatePostMiddleware, PaymentPost)

module.exports = router
