import { IPaymentType } from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { Observable } from 'rxjs/Observable';

const paymentTypes: IPaymentType[] = [
  { id: 'CHEQUE', name: 'Cheque' },
  { id: 'CASH', name: 'Cash' },
  { id: 'ALLPAY', name: 'Allpay' },
  { id: 'POSTAL_ORDER', name: 'Postal order' },
  { id: 'CARD', name: 'Card' }
];

export class PaymentstateServiceMock {
  currentOpenedFeeTab = 1;
  paymentTypes = new Observable<IPaymentType[]>(observer => {
    observer.next(paymentTypes),
    observer.complete();
  });
  paymentTypeEnum = new Observable<PaymentTypeEnum>(observer => {
    observer.next(new PaymentTypeEnum()),
    observer.complete();
  });
}
