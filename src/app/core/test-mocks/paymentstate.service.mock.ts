import { IPaymentType } from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';

const paymentTypes: IPaymentType[] = [
  { id: 'CHEQUE', name: 'Cheque' },
  { id: 'CASH', name: 'Cash' },
  { id: 'ALLPAY', name: 'Allpay' },
  { id: 'POSTAL_ORDER', name: 'Postal order' },
  { id: 'CARD', name: 'Card' }
];

export class PaymentstateServiceMock {
  currentOpenedFeeTab = 1;
  paymentTypes = new Promise<IPaymentType[]>((resolve, reject) => {
    resolve(paymentTypes);
  });
  paymentTypeEnum = new Promise<PaymentTypeEnum>((resolve, reject) => {
    resolve(new PaymentTypeEnum());
  });
}
