import { TestBed, inject } from '@angular/core/testing';

import { PaymentstateService } from './paymentstate.service';

describe('PaymentstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentstateService]
    });
  });

  it('should be created', inject([PaymentstateService], (service: PaymentstateService) => {
    expect(service).toBeTruthy();
  }));
});
