import { BarHttpClient } from '../httpclient/bar.http.client';
import { instance, mock } from 'ts-mockito';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MonitoringService } from './monitoring.service';
import { of } from 'rxjs';
import { AppInsights } from 'applicationinsights-js';

describe('MonitoringService', () => {
  let http: BarHttpClient, monitoringService: MonitoringService;

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    monitoringService = new MonitoringService(http);
    spyOn(http, 'get').and.returnValue(of({key: 'some-key'}));
  });

  it('should send an event to appinsights server', () => {
    spyOn(AppInsights, 'trackEvent').and.callThrough();
    monitoringService.logEvent('this is an event');
    expect(AppInsights.trackEvent).toHaveBeenCalled();
  });

  it('should send exception to appinsights server', () => {
    spyOn(AppInsights, 'trackException').and.callThrough();
    monitoringService.logException(new Error('this is an error'));
    expect(AppInsights.trackException).toHaveBeenCalled();
  });

  it('should send a pageview to appinsights server', () => {
    spyOn(AppInsights, 'trackPageView').and.callThrough();
    monitoringService.logPageView('this is a page which has been loaded');
    expect(AppInsights.trackPageView).toHaveBeenCalled();
  });
});
