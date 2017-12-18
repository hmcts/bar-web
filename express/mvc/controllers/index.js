const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController()
};
