// import the payment service
const PaymentService = require('../../services').PaymentService;

// export payment types controller
exports.GET_index = (req, res) => {
  PaymentService.getPaymentTypes()
    .then(response => { res.json(response.data); })
    .catch(error => {console.log(error); res.json({ error: error.message })});
};

exports.POST_index = (req, res) => {
  const data = req.body;
  const paymentType = req.params.type;

  PaymentService.sendPaymentDetails(data, paymentType)
    .then(status => { res.json(status.data) })
    .catch(error => { res.json({ error: error.message }); });
};
