const path = require('path')
const express = require('express')
const router = express.Router()
const PaymentsMiddleware = require('./validators/payments')
// const PaymentModule = require('./services/PaymentModule')

// Responsible for sending out payment types
// @TODO: Send request to RESTful API via the port (bar.url) in config file via ServiceModule
router.get('/payment-types', async (req, res) => {
	res.json([
    {id: 1, name: 'Cheque'},
    {id: 2, name: 'Cash'},
    {id: 3, name: 'Postal Order'},
    {id: 4, name: 'Card'},
    // {id: 5, name: 'Full Remission'},
    {id: 6, name: 'AllPay'}
  ])
})

// Responsible for handling payments
router.post('/payments', PaymentsMiddleware.ValidatePostMiddleware, (req, res) => {
	console.log( req.body )
	return res.json(req.body)
})

module.exports = router
