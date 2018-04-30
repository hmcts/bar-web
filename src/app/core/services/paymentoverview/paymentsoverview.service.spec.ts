import { TestBed, inject } from '@angular/core/testing';

import { PaymentsOverviewService } from './paymentsoverview.service';

describe('PaymentsOverviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentsOverviewService]
    });
  });

  it('should be created', inject([PaymentsOverviewService], (service: PaymentsOverviewService) => {
    expect(service).toBeTruthy();
  }));

});
