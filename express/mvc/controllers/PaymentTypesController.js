// import the payment service
const PaymentService = require('../../services').PaymentService;

// export payment types controller
exports.GET_index = async (req, res) => {
  const paymentTypes = await PaymentService.getPaymentTypes();
  res.json(paymentTypes);
};

exports.POST_index = (req, res) => {
  console.log( req.body );
  return res.json(req.body);
};
