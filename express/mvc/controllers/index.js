const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeLogController = require('./FeeLogController');

module.exports = {
  PaymentsController: new PaymentsController,
  PaymentsLogController: new PaymentsLogController,
  FeeLogController: new FeeLogController
};
