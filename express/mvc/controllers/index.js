const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');
const UsrController = require('./UsrController');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController(),
  feesController: new FeeController(),
  userController: new UsrController()
};
