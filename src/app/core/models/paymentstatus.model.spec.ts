import {PaymentStatus} from './paymentstatus.model';

describe('PaymentStatus', () => {

  it('pending Review should exist', () => {
    expect(PaymentStatus.getPayment('PR')).toBeTruthy();
  });

  it('pending Review code input should return exact code', () => {
    expect(PaymentStatus.getPayment('PR').code).toBe('PR');
  });

  it('draft code should return the correct label', () => {
    expect(PaymentStatus.getPayment('D').label).toBe('Draft');
  });

  it('pending should return the correct code', () => {
    expect(PaymentStatus.getPayment('Pending').code).toBe('P');
  });

  it('should be undefined', () => {
    expect(PaymentStatus.getPayment('somethingRandom?')).toBeUndefined();
  });

});
