import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { IResponse } from '../../../core/interfaces';

export interface IPaymentstateService {
  currentOpenedFeeTab: number;
  paymentTypes: BehaviorSubject<IPaymentType[]>;
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum>;

  setPaymentTypeEnum(data: Subject<IPaymentType[]>): Observable<PaymentTypeEnum>;
  setCurrentOpenedFeeTab(currentTab: number);
  getPaymentTypes(): Observable<IResponse>;
}
