// import the payment service
const PaymentService = require('../../services').PaymentService;

// export payment types controller
exports.GET_index = async (req, res) => {
  try {
    const paymentTypes = await PaymentService.getPaymentTypes();
    return res.json(paymentTypes.data);
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};

exports.POST_index = async (req, res) => {
  const data = req.body;
  const paymentType = req.params.type;

  try {
    const payment = await PaymentService.sendPaymentDetails(data, paymentType);
    return res.json(payment.data);
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};
