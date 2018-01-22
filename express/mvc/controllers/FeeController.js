const fees = require('./../../../data/fees_search_results_response');

class FeeController {
  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFees = [];

      for (let i = 0; i < fees.length; i++) {
        if (fees[i].code.includes(req.query.code)) {
          selectedFees.push(fees[i]);
        }
      }

      // if the code has been found
      return res.json({ found: true, fees: selectedFees });
    }

    return res.json({ found: true, fees });
  }
}

module.exports = FeeController;
