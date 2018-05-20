import { PaymentParent } from './payment-parent.model';
import { PaymentTypeModel } from './paymenttype.model';

describe('FeeSearchModel', () => {
  let paymentParent: PaymentParent;

  beforeEach(() => {
    paymentParent = new PaymentParent();
    paymentParent['unallocated_amount'] = 1000;
  });

  it('test get payment reference', () => {
    paymentParent.payment_type = new PaymentTypeModel();
    paymentParent.payment_type.id = 'cheques';
    paymentParent.payment_type.name = 'Cheque';
    paymentParent.cheque_number = '12345';
    expect(paymentParent.getPaymentReference()).toEqual('12345');
  });

  it('test get unallacated amount', () => {
    expect(paymentParent.getProperty('unallocated_amount')).toEqual(10);
  });
});
