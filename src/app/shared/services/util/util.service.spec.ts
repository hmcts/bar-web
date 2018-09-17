import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';
import { createPaymentInstruction, createMockUser } from '../../../test-utils/test-utils';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { UserRole } from '../../../core/models/userrole.model';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));

  it('should correctly convert to uppercase / capitalize.', () => {
    const name = 'damien johnson';
    expect(UtilService.convertToUpperCase(name)).toBe('Damien Johnson');
  });

  it('should return false', () => {
    const model = createPaymentInstruction();
    const userModel = createMockUser(UserRole.FEECLERK);
    expect(UtilService.checkIfReadOnly(model, userModel)).toBeFalsy();
  });

  it('should return false as the user is a fee clerk', () => {
    const model = createPaymentInstruction();
    const userModel = createMockUser(UserRole.FEECLERK);
    expect(UtilService.checkIfReadOnly(model, userModel)).toBeFalsy();
  });

  it('should return true as the user is a senior fee clerk', () => {
    const model = createPaymentInstruction();
    const userModel = createMockUser(UserRole.SRFEECLERK);
    expect(UtilService.checkIfReadOnly(model, userModel)).toBeTruthy();
  });

  it('should return true as the status of the PI is Validated', () => {
    const model = createPaymentInstruction();
    const userModel = createMockUser(UserRole.SRFEECLERK);
    model.status = PaymentStatus.getPayment('Validated').code;
    expect(UtilService.checkIfReadOnly(model, userModel)).toBeTruthy();
  });

  it('should return an error as expected (from the promise).', async () => {
    const promise = new Promise((resolve, reject) =>
      reject(new Error('Something went wrong.'))
    );
    const [err, data] = await UtilService.toAsync(promise);
    expect(err).toBeTruthy();
  });
});
