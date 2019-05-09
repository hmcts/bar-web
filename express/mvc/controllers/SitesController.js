const httpStatusCodes = require('http-status-codes');

class SitesController {
  /**
   * Creates an instance of SitesController.
   * @param {SitesService} sitesService
   * @memberof SitesController
   */
  constructor(SitesService) {
    this.sitesService = sitesService;
    this.getSites = this.getSites.bind(this);
  }

  getSites(req, res) {
    return this.sitesService.getSites(req)
      .then(data => {
        res.json(data.body);
      })
      .catch(err => {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.toString() });
      });
  }
}

module.exports = SitesController;
