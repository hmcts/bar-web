const PaymentService = require('./PaymentService');
const PaymentsLogService = require('./PaymentsLogService');
const FeeLogService = require('./FeeLogService');
module.exports = {
  PaymentService: new PaymentService,
  PaymentsLogService: new PaymentsLogService,
  FeeLogService: new FeeLogService
}