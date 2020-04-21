import * as config from 'config';
import * as appInsights from 'applicationinsights';

export class AppInsights {
  static enable () {
    appInsights.setup(config.get<string>('secrets.bar.AppInsightsInstrumentationKey'))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, true)
      .start();
  }
}
