const express = require('express')
const router = express.Router()
const PaymentsMiddleware = require('./validators/payments')

// whatever url is place here, it'll make a request to the API
// router.get('**', async (req, res) => {
//   res.json({ messsage: 'sdfoidsfdsioj', url: req.url });
// })

// default home page for API
router.get('/', (req, res) => {
  return res.json({
    message: 'Welcome to BAR API via NodeJS'
  })
})

// Responsible for sending out payment types
router.get('/payment-types', (req, res) => {
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
