import { TestBed, inject } from '@angular/core/testing';

import { ApiroutesService } from './apiroutes.service';

describe('ApiroutesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiroutesService]
    });
  });

  it('should be created', inject([ApiroutesService], (service: ApiroutesService) => {
    expect(service).toBeTruthy();
  }));
});
