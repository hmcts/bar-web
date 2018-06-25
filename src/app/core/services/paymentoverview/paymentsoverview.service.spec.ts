import { TestBed, inject } from '@angular/core/testing';

import { PaymentsOverviewService } from './paymentsoverview.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule, BaseRequestOptions} from '@angular/http';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';

describe('PaymentsOverviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpModule],
      providers: [PaymentsOverviewService, BarHttpClient]
    });
  });

  it('should be created', inject([PaymentsOverviewService], (service: PaymentsOverviewService) => {
    expect(service).toBeTruthy();
  }));

});
