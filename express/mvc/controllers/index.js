const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');
const PaymentInstructionController = require('./PaymentInstructionController');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController(),
  feesController: new FeeController(),
  paymentInstructionController: new PaymentInstructionController()
};
