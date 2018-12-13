import { PaymentParent } from './payment-parent.model';
import { PaymentTypeModel } from './paymenttype.model';
import { createChequePaymentType,
  createPostalOrderPaymentType,
  createAllPayPaymentType,
  createCardPaymentType } from '../../test-utils/test-utils';
import { PaymentTypeEnum } from './payment.type.enum';

describe('FeeSearchModel', () => {
  let paymentParent: PaymentParent;
  const paymentTypeEnum = new PaymentTypeEnum();

  beforeEach(() => {
    paymentParent = new PaymentParent();
    paymentParent['unallocated_amount'] = 1000;
    paymentParent.currency = 'GBP';
  });

  it('test get unallacated amount', () => {
    expect(paymentParent.getProperty('unallocated_amount')).toEqual(10);
  });

  it('test get unknown property', () => {
    expect(paymentParent.getProperty('unknown')).toEqual('');
  });

  it('test get standard property', () => {
    expect(paymentParent.getProperty('currency')).toEqual('GBP');
  });

  it('test isEmpty() method and see if property is genuinely not empty', () => {
    paymentParent.payer_name = 'Earl Harrison';
    expect(paymentParent.isEmpty('payer_name')).toBeFalsy();
  });

  it('test isEmpty() method and see if property is genuinely not empty', () => {
    expect(paymentParent.isEmpty('payer_name')).toBeTruthy();
  });

});
