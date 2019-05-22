const config = require('config');

const barUrl = config.get('bar.url');

class SitesService {
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getFeatures = this.getSites.bind(this);
  }

  getSites(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/sites${this.createQueryString(req.query)}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }

  getSite(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/sites/${req.params.siteId}/users`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }

  addUserToSite(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/sites/${req.params.siteId}/users/${req.params.email}`,
      method: 'POST',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }

  removeUserFromSite(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/sites/${req.params.siteId}/users/${req.params.email}`,
      method: 'DELETE',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }

  createQueryString(query) {
    if (query) {
      return Object.keys(query).reduce((qStr, key) => {
        if (!qStr) {
          return `?${key}=${query[key]}`;
        }
        return `${qStr}&${key}=${query[key]}`;
      }, '');
    }
    return '';
  }
}

module.exports = SitesService;
