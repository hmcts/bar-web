const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');
const PaymentInstructionController = require('./PaymentInstructionController');
const PaymentsOverviewController = require('../controllers/PaymentsOverviewController');
const FeatureController = require('./FeatureController');
const PaymentActionController = require('./PaymentActionController');
const SitesController = require('./SitesController');

// --- services ---
const { response } = require('./../../services/UtilService');
const {
  feeService,
  featureService,
  paymentsLogService,
  paymentInstructionService,
  utilService,
  paymentActionService,
  sitesService
} = require('./../../services');

module.exports = {
  paymentsController: new PaymentsController({ response }),
  paymentsLogController: new PaymentsLogController({ paymentsLogService }),
  feesController: new FeeController({ feeService, utilService }),
  paymentInstructionController: new PaymentInstructionController({ paymentInstructionService }),
  paymentsOverviewController: new PaymentsOverviewController(),
  featureController: new FeatureController(featureService),
  paymentActionController: new PaymentActionController({ response, paymentActionService }),
  sitesController: new SitesController(sitesService)

};
