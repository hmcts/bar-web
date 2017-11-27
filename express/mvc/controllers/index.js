const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');

module.exports = {
  payments: new PaymentsController,
  paymentsLog: new PaymentsLogController
};
