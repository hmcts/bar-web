const data = require('./../../../data/fees_search_results_response');

class FeeController {

  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFee = data.find(fee => {
        return fee.code === req.query.code;
      });

      if (typeof selectedFee !== 'undefined') { // if the code has been found
        return res.json({ found: true, selectedFee });
      }

      return res.json({ found: false });
    }
    return res.json(data);
  }

}

module.exports = FeeController;
