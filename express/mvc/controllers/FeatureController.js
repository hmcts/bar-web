const httpStatusCodes = require('http-status-codes');

class FeatureController {
  /**
   * Creates an instance of FeatureController.
   * @param {FeatureService} feeService
   * @memberof FeatureController
   */
  constructor(featureService) {
    this.featureService = featureService;
    this.getFeatures = this.getFeatures.bind(this);
    this.putFeature = this.putFeature.bind(this);
  }

  getFeatures(req, res) {
    return this.featureService.getFeatures(req)
      .then(data => {
        res.json(data.body);
      })
      .catch(err => {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.toString() });
      });
  }

  putFeature(req, res) {
    return this.featureService.updateFeature(req.params.feat_uid, req)
      .then(data => {
        res.json(data.body);
      })
      .catch(err => {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.toString() });
      });
  }
}

module.exports = FeatureController;
