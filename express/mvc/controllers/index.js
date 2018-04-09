const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController(),
  feesController: new FeeController()
};
