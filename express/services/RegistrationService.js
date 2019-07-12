const config = require('config');
const requestPromise = require('client-request/promise');

const REGISTER_USER_UID = 'register-user-idam';

class RegistrationService {
  constructor(featureService) {
    this.featureService = featureService;
    this.requestPromise = requestPromise;
  }
  registerUser(req) {
    return this.featureService.getFeatures(req)
      .then(data => this.isRegistrationFeatureTurnedOn(data.body))
      .then(isOn => {
        if (!isOn) {
          return 'registration is switched off';
        }
        const token = this.getAccessToken(req);
        const options = {
          uri: `${config.idam.api_url}/user/registration`,
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: '*/*'
          },
          method: 'POST',
          json: true,
          body: {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles
          }
        };
        return this.requestPromise(options);
      });
  }

  getAccessToken(req) {
    return req.authToken;
  }

  isRegistrationFeatureTurnedOn(features) {
    const regFeature = features.find(feature => feature.uid === REGISTER_USER_UID);
    return regFeature ? regFeature.enable : false;
  }
}

module.exports = RegistrationService;