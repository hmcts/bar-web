const fees = require('./../../../data/fees_search_results_response');
const { feeService, utilService } = require('../../services');

class FeeController {
  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFees = [];

      for (let i = 0; i < fees.length; i++) {
        if (fees[i].code.includes(req.query.code.toUpperCase())) {
          selectedFees.push(fees[i]);
        } else if (typeof fees[i].current_version !== 'undefined' && Object.keys(fees[i].current_version).length > 0 && (fees[i].current_version.description.includes(req.query.code) || fees[i].current_version.description.toLowerCase().includes(req.query.code))) {
          selectedFees.push(fees[i]);
        }
      }

      // if the code has been found
      return res.json({ found: true, fees: selectedFees });
    }

    return res.json({ found: true, fees });
  }

  async postAddFeeToCase(req, res) {
    const [err, data] = await utilService.asyncTo(feeService.addFeeToCase(req.params.id, req.body));
    if (!err) {
      return res.json({ data: data.body, id: req.params.id });
    }

    return res.json({ data: req.body, id: req.param.id });
  }
}

module.exports = FeeController;
