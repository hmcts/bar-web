const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');
const PaymentInstructionController = require('./PaymentInstructionController');
const PaymentsOverviewController = require('../controllers/PaymentsOverviewController');

// --- services ---
const { paymentsLogService } = require('./../../services');

module.exports = {
  paymentsController: new PaymentsController(),
  paymentsLogController: new PaymentsLogController({ paymentsLogService }),
  feesController: new FeeController(),
  paymentInstructionController: new PaymentInstructionController(),
  paymentsOverviewController: new PaymentsOverviewController()
};
