// import the payment service
const PaymentsLogService = require('../../services').PaymentsLogService;

class PaymentsLogController {

	get_index(req, res) {
		PaymentsLogService.getPaymentsLog()
	    	.then(response => res.json(response.body))
		    .catch(error => res.json({ error: error.message }));
	}

}

module.exports = PaymentsLogController;
