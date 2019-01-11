import { IPaymentType } from '../interfaces/payments-log';
import { PaymentTypeEnum } from './payment.type.enum';

describe('PaymentTypeEnum', () => {

  it('Configure enum with values from db', () => {
    const types: IPaymentType[] = [
      {id: 'cards', name: ''},
      {id: 'cash', name: ''},
      {id: 'cheques', name: ''},
      {id: 'postal-orders', name: ''},
      {id: 'allpay', name: ''},
      {id: 'remissions', name: 'Full Remission'}
    ];
    const typeEnum = new PaymentTypeEnum();
    typeEnum.configure(types);
    expect(typeEnum.CARD).toBe('cards');
    expect(typeEnum.CASH).toBe('cash');
    expect(typeEnum.CHEQUE).toBe('cheques');
    expect(typeEnum.POSTAL_ORDER).toBe('postal-orders');
    expect(typeEnum.ALLPAY).toBe('allpay');
    expect(typeEnum.FULL_REMISSION).toBe('remissions');
  });
});
