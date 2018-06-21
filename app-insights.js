const config = require('config');
const appInsights = require('applicationinsights');

module.exports = {
  enable() {
    appInsights.setup(config.get('appInsights.instrumentationKey'))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, true)
      .start();
  }
};
