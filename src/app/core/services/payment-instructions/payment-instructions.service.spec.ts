import { TestBed, inject } from '@angular/core/testing';

import { PaymentInstructionsService } from './payment-instructions.service';

describe('PaymentInstructionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentInstructionsService]
    });
  });

  it('should be created', inject([PaymentInstructionsService], (service: PaymentInstructionsService) => {
    expect(service).toBeTruthy();
  }));
});
