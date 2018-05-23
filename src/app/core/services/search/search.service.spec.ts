import { TestBed, inject } from '@angular/core/testing';

import { SearchService } from './search.service';
import { createPaymentInstruction } from '../../../test-utils/test-utils';

describe('SearchService', () => {
  const searchService = new SearchService();

  it('populatePaymentLogs', () => {
    const pi = createPaymentInstruction();
    const piLog = [pi];
    searchService.populatePaymentLogs(piLog);
    expect(searchService.populatePaymentLogs).toBeTruthy();
    expect(searchService.paymentLogs).toBe(piLog);
  });
});
