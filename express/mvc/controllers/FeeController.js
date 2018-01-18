const data = require('./../../../data/fees_search_results_response');

class FeeController {
  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFee = data.find(fee => fee.code === req.query.code);

      // if the code has been found
      if (typeof selectedFee !== 'undefined') {
        return res.json({ found: true, selectedFee });
      }

      return res.json({ found: false });
    }
    return res.json(data);
  }
}

module.exports = FeeController;
