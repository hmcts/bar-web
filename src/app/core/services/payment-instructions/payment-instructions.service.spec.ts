import { TestBed, inject } from '@angular/core/testing';

import { PaymentInstructionsService } from './payment-instructions.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

describe('PaymentInstructionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientModule],
      providers: [PaymentInstructionsService]
    });
  });

  it('should be created', inject([PaymentInstructionsService], (service: PaymentInstructionsService) => {
    expect(service).toBeTruthy();
  }));
});
