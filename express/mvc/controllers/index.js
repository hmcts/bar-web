const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');

module.exports = {
  PaymentsController: new PaymentsController,
  PaymentsLogController: new PaymentsLogController
};
