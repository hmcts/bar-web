const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeLogController = require('./FeeLogController');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController(),
  feeLogController: new FeeLogController()
};
