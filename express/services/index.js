const PaymentService = require('./PaymentService');
const PaymentsLogService = require('./PaymentsLogService');
module.exports = {
  PaymentService: new PaymentService,
  PaymentsLogService: new PaymentsLogService
}