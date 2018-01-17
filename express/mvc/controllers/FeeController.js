const data = require('./../../../data/fees_search_results_response');

class FeeController {

  getIndex(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const newData = data.findIndex(something => {
        return something.code === req.query.code;
      });
      return res.json(newData);
    }
    return res.json(data);
  }

}

module.exports = FeeController;
