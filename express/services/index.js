const PaymentService = require('./PaymentService');
const PaymentsLogService = require('./PaymentsLogService');
const FeeLogService = require('./FeeLogService');
const FeeService = require('./FeeService');
const UtilService = require('./UtilService');
const PaymentInstructionService = require('./PaymentInstructionService');
const PaymentsOverviewService = require('./PaymentsOverviewService');

const { makeHttpRequest } = UtilService;

module.exports = {
  paymentService: new PaymentService(makeHttpRequest),
  paymentsLogService: new PaymentsLogService(),
  feeLogService: new FeeLogService(),
  utilService: UtilService,
  feeService: new FeeService(makeHttpRequest),
  paymentInstructionService: new PaymentInstructionService(makeHttpRequest),
  paymentsOverviewService: new PaymentsOverviewService()
};
