const PaymentService = require( './PaymentService' );
const PaymentsLogService = require( './PaymentsLogService' );
const FeeLogService = require( './FeeLogService' );

module.exports = {
  paymentService: new PaymentService,
  paymentsLogService: new PaymentsLogService,
  feeLogService: new FeeLogService
};
