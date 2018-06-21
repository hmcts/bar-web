const config = require('config');

const barUrl = config.get('bar.url');

class FeatureService {
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getFeatures = this.getFeatures.bind(this);
    this.updateFeature = this.updateFeature.bind(this);
  }

  getFeatures(req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/api/ff4j/store/features`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }

  updateFeature(featUid, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/api/ff4j/store/features/${featUid}`,
      method: 'PUT',
      json: true,
      body: req.body,
      headers: { 'Content-Type': 'application/json' }
    }, req);
  }
}

module.exports = FeatureService;
