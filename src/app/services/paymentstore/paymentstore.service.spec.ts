import { TestBed, inject } from '@angular/core/testing';

import { PaymentstoreService } from './paymentstore.service';

describe('PaymentstoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentstoreService]
    });
  });

  it('should be created', inject([PaymentstoreService], (service: PaymentstoreService) => {
    expect(service).toBeTruthy();
  }));
});
