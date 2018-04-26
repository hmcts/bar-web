const PaymentService = require('./PaymentService');
const PaymentsLogService = require('./PaymentsLogService');
const FeeLogService = require('./FeeLogService');
const FeeService = require('./FeeService');
const UtilService = require('./UtilService');
const PaymentInstructionService = require('./PaymentInstructionService');

module.exports = {
  paymentService: new PaymentService(),
  paymentsLogService: new PaymentsLogService(),
  feeLogService: new FeeLogService(),
  utilService: new UtilService(),
  feeService: new FeeService(),
  paymentInstructionService: new PaymentInstructionService()
};
