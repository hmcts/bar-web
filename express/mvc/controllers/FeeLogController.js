// import the fee log service
const FeeLogService = require('../../services').FeeLogService;

class FeeLogController {

    get_index(req, res) {
        FeeLogService.getFeeLog()
            .then(response => res.json({ data: response.body, success: true }))
            .catch(error => res.json({ data: {}, error: error.message, success: false }));
    }

}

module.exports = FeeLogController;
