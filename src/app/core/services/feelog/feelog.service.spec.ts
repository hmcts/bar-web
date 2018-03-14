import { TestBed, inject } from '@angular/core/testing';

import { FeelogService } from './feelog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

describe('FeelogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule ],
      providers: [FeelogService]
    });
  });

  it('should be created', inject([FeelogService], (service: FeelogService) => {
    expect(service).toBeTruthy();
  }));
});
