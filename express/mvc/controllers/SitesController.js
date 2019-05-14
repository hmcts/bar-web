const { errorHandler } = require('../../services/UtilService');

class SitesController {
  /**
   * Creates an instance of SitesController.
   * @param {SitesService} sitesService
   * @memberof SitesController
   */
  constructor(sitesService) {
    this.sitesService = sitesService;
    this.getSites = this.getSites.bind(this);
    this.getSite = this.getSite.bind(this);
    this.addUserToSite = this.addUserToSite.bind(this);
  }

  getSites(req, res) {
    return this.sitesService.getSites(req)
      .then(data => {
        res.status(data.response.statusCode).send(data.body);
      })
      .catch(err => {
        errorHandler(res, err, 'SitesController.js');
      });
  }

  getSite(req, res) {
    return this.sitesService.getSite(req)
      .then(data => {
        res.status(data.response.statusCode).send(data.body);
      })
      .catch(err => {
        errorHandler(res, err, 'SitesController.js');
      });
  }

  addUserToSite(req, res) {
    return this.sitesService.addUserToSite(req)
      .then(data => {
        res.status(data.response.statusCode).send(data.body);
      })
      .catch(err => {
        errorHandler(res, err, 'SitesController.js');
      });
  }
}

module.exports = SitesController;
