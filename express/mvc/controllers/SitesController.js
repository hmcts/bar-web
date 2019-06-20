const { errorHandler } = require('../../services/UtilService');
const registrationService = require('../../services/RegistrationService');

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
    this.removeUserFromSite = this.removeUserFromSite.bind(this);
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
    let registrationError = null;
    return registrationService.registerUser(req)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        registrationError = error.body ? error.body : error.message;
      })
      .then(() => this.sitesService.addUserToSite(req))
      .then(data => {
        const resp = data.body || {};
        resp.registrationError = registrationError;
        res.status(data.response.statusCode).send(resp);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        errorHandler(res, err, 'SitesController.js');
      });
  }

  removeUserFromSite(req, res) {
    return this.sitesService.removeUserFromSite(req)
      .then(data => {
        res.status(data.response.statusCode).send(data.body);
      })
      .catch(err => {
        errorHandler(res, err, 'SitesController.js');
      });
  }
}

module.exports = SitesController;
