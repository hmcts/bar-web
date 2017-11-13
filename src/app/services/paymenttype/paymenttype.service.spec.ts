import { TestBed, inject } from '@angular/core/testing';

import { PaymenttypeService } from './paymenttype.service';

describe('PaymenttypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymenttypeService]
    });
  });

  it('should be created', inject([PaymenttypeService], (service: PaymenttypeService) => {
    expect(service).toBeTruthy();
  }));
});
