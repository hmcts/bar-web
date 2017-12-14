// import the fee log service
const FeeLogService = require('../../services').feeLogService;

/**
 * Responsible for handling anything to
 * do with Fees
 */
class FeeLogController {
  /**
   * Gets the fee log
   * @param {express.Request} req
   * @param {express.Response} res
   */
  getIndex(req, res) {
    FeeLogService.getFeeLog()
      .then(response => {
        res.json({ data: response.body, success: true });
      })
      .catch(error => {
        res.json({ data: {}, error: error.message, success: false });
      });
  }
}

module.exports = FeeLogController;
