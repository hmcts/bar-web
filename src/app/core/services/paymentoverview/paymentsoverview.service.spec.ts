import { TestBed, inject } from '@angular/core/testing';

import { PaymentsOverviewService } from './paymentsoverview.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';

describe('PaymentsOverviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpModule],
      providers: [PaymentsOverviewService]
    });
  });

  it('should be created', inject([PaymentsOverviewService], (service: PaymentsOverviewService) => {
    expect(service).toBeTruthy();
  }));

});
