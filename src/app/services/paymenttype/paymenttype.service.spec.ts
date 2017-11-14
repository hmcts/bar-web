import { TestBed, inject } from '@angular/core/testing';

import { PaymenttypeService } from './paymenttype.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

describe('PaymenttypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule ],
      providers: [PaymenttypeService]
    });
  });

  it('should be created', inject([PaymenttypeService], (service: PaymenttypeService) => {
    expect(service).toBeTruthy();
  }));
});
