import {IPaymentsLog, IPaymentType} from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { IResponse } from '../interfaces';
import { map } from 'rxjs/operators';
import {IPaymentAction} from '../interfaces/payment-actions';

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
  paymentInstructions$: Observable<IPaymentsLog[]>;

  paymentActions$: Observable<IPaymentAction[]> = of(JSON.parse(`
    [{"action":"Process"},{"action":"Suspense"},
    {"action":"Suspense Deficiency"},{"action":"Return"},{"action":"Refund"},
    {"action":"Withdraw"}]`));
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

