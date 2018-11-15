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

  it('test get cheque payment reference', () => {
    paymentParent.payment_type = createChequePaymentType();
    paymentParent.cheque_number = '12345';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('12345');
  });

  it('test get postal-orders payment reference', () => {
    paymentParent.payment_type = createPostalOrderPaymentType();
    paymentParent.postal_order_number = 'ABC123';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('ABC123');
  });

  it('test get allpay payment reference', () => {
    paymentParent.payment_type = createAllPayPaymentType();
    paymentParent.all_pay_transaction_id = 'qwerty';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('qwerty');
  });

  it('test get card payment reference (which should be blank, as this isn\'t stored)', () => {
    paymentParent.payment_type = createCardPaymentType();
    paymentParent.authorization_code = '  CARD123  ';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('CARD123');
  });

  it('test get a new payment reference', () => {
    paymentParent.payment_type = new PaymentTypeModel();
    paymentParent.payment_type.id = 'new-payment';
    paymentParent.payment_type.name = 'New Payment';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('');
  });

  it('test get a payment reference without name', () => {
    paymentParent.payment_type = new PaymentTypeModel();
    paymentParent.payment_type.id = paymentTypeEnum.CARD;
    paymentParent.authorization_code = 'CARD123';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('');
  });

  it('test get a payment reference without type', () => {
    paymentParent.authorization_code = '  CARD123  ';
    expect(paymentParent.getPaymentReference(paymentTypeEnum)).toEqual('');
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
