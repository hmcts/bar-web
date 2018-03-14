import { TestBed, inject } from '@angular/core/testing';

import { PaymentslogService } from './paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

describe('PaymentslogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule ],
      providers: [PaymentslogService]
    });
  });

  it('should be created', inject([PaymentslogService], (service: PaymentslogService) => {
    expect(service).toBeTruthy();
  }));
});
