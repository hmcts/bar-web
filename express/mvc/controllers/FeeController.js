const fees = require('./../../../data/fees_search_results_response');

class FeeController {
  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFees = fees.filter(fee => fee.code.includes(req.query.code));

      // if the code has been found
      return res.json({ found: true, fees: selectedFees });
    }

    return res.json({ found: true, fees });
  }
}

module.exports = FeeController;
