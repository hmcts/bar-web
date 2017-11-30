// import the payment log service
const PaymentsLogService = require('../../services').PaymentsLogService;

class PaymentsLogController {

  get_index(req, res) {
  	PaymentsLogService.getPaymentsLog()
      .then(response => res.json({ data: response.body, success: true }))
      .catch(error => res.json({ data: {}, error: error.message, success: false }));
  }

}

module.exports = PaymentsLogController;
