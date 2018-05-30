import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));

  it('Should correctly convert to uppercase / capitalize.', () => {
    const name = 'damien johnson';
    expect(UtilService.convertToUpperCase(name)).toBe('Damien Johnson');
  });
});
