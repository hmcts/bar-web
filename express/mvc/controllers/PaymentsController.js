// import the payment service
const PaymentService = require('../../services').PaymentService;

// export payment types controller
exports.GET_index = (req, res) => {
  PaymentService.getPaymentTypes()
    .then(response => res.json(response.body))
    .catch(error => res.json({ error: error.message }));
};

exports.POST_index = (req, res) => {
  const data = req.body;
  const paymentType = req.params.type;

  PaymentService.sendPaymentDetails(data, paymentType)
    .then(response => { console.log( response.body ); res.json(response.body) })
    .catch(error => { res.json({ error: error.message }); });
};
