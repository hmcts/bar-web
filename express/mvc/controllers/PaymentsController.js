// import the payment service
const PaymentService = require('../../services').PaymentService;
const axios = require('axios');
const config = require('config');
const barUrl = config.get('bar.url');

// export payment types controller
exports.GET_index = (req, res) => {
	PaymentService.getPaymentTypes()
	  .then(data => { console.log( data ); res.json(data.data); })
      .catch(error => res.status(500).json({ error: error.message }));
};

exports.POST_index = (req, res) => {
  const data = req.body;
  const paymentType = req.params.type;

  PaymentService.sendPaymentDetails(data, paymentType)
    .then(status => { console.log( status ); res.json(status.data) })
    .catch(error => res.status(500).json({ error: error.message }));
};
