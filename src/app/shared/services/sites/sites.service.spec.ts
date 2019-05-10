import { SitesService } from './sites.service';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { mock, instance } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('SitesService', () => {
  let http, sitesService;

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    sitesService = new SitesService(http);
  });

  it('should load service', () => {
    expect(sitesService).toBeTruthy();
  });

  it('should send the right response', () => {
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return of({ data: [], success: true });
    });

    sitesService.getSites('mock@email.com');
    expect(calledWithParam).toEqual('/api/sites/users/mock@email.com');
  });
});
