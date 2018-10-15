import { IPaymentType } from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

const paymentTypes: IPaymentType[] = [
  { id: 'CHEQUE', name: 'Cheque' },
  { id: 'CASH', name: 'Cash' },
  { id: 'ALLPAY', name: 'Allpay' },
  { id: 'POSTAL_ORDER', name: 'Postal order' },
  { id: 'CARD', name: 'Card' }
];

export class PaymentStateServiceMock {
  currentOpenedFeeTab = 1;
  paymentTypes = new BehaviorSubject<IPaymentType[]>(paymentTypes);
  paymentTypeEnum = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  paymentActions$ = of([]);
}
