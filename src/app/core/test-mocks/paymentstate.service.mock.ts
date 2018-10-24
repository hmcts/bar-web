import { IPaymentType } from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { IResponse } from '../interfaces';
import { map } from 'rxjs/operators';
import { IPaymentstateService } from '../../shared/services/state/paymentstate.service.interface';
import {IPaymentAction} from '../interfaces/payment-actions';
import {BarHttpClientMock} from './bar.http.client.mock';

const paymentTypes: IPaymentType[] = [
  { id: 'CHEQUE', name: 'Cheque' },
  { id: 'CASH', name: 'Cash' },
  { id: 'ALLPAY', name: 'Allpay' },
  { id: 'POSTAL_ORDER', name: 'Postal order' },
  { id: 'CARD', name: 'Card' }
];

export class PaymentstateServiceMock {
  currentOpenedFeeTab = 1;
  paymentTypes = new BehaviorSubject<IPaymentType[]>(paymentTypes);
  paymentTypeEnum = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());

  paymentActions$: Observable<IPaymentAction>;
  selectedPaymentAction$: BehaviorSubject<IPaymentAction> = new BehaviorSubject<IPaymentAction>({ action: 'Process' });

  // start: http methods -----------------------------------------------------
  getPaymentActions(): Observable<IResponse> {
    return of({data: [], success: true});
  }

  getPaymentTypes(): Observable<IResponse> {
    return of({data: paymentTypes, success: true});
  }
  // end: http methods -----------------------------------------------------

  switchPaymentAction(action: IPaymentAction) {
  }

  setPaymentTypeEnum(data: Subject<IPaymentType[]>): Observable<PaymentTypeEnum> {
    return data.pipe(map(pTypes => {
      const ptEnum = new PaymentTypeEnum();
      ptEnum.configure(pTypes);
      return ptEnum;
    }));
  }

  setCurrentOpenedFeeTab(currentTab: number) {
    this.currentOpenedFeeTab = currentTab;
  }
}

