import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class MonitoringService {

  private config: Microsoft.ApplicationInsights.IConfig;

  constructor(private http: BarHttpClient) {
  }

  logPageView(name?: string, url?: string, properties?: any,
      measurements?: any, duration?: number) {
    this.send(() => {
      console.log('logging page view...');
      AppInsights.trackPageView(name, url, properties, measurements, duration);
    });
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    this.send(() => {
      console.log('logging an event...');
      AppInsights.trackEvent(name, properties, measurements);
    });
  }

  logException(exception: Error) {
    this.send(() => {
      console.log('logging an exception...');
      AppInsights.trackException(exception);
    });
  }

  private send(func: Function): void {
    if (this.config && this.config.instrumentationKey) {
      func();
    } else {
      this.http.get('/api/monitoring-tools').subscribe(it => {
        this.config = {
          instrumentationKey: it['key']
        };
        if (!AppInsights.config) {
          AppInsights.downloadAndSetup(this.config);
        }
        func();
      });
    }
  }
}
