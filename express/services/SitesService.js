const config = require('config');

const barUrl = config.get('bar.url');

class SitesService {
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getFeatures = this.getSites.bind(this);
  }

  getSites(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/sites/users/${req.params.email}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }
}

module.exports = SitesService;