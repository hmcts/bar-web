import {IPaymentsLog, IPaymentType} from '../interfaces/payments-log';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { IResponse } from '../interfaces';
import { map } from 'rxjs/operators';
import { IPaymentstateService } from '../../shared/services/state/paymentstate.service.interface';
import {getPaymentInstructions} from '../../test-utils/test-utils';
import {IPaymentAction} from '../interfaces/payment-actions';

const paymentTypes: IPaymentType[] = [
  { id: 'CHEQUE', name: 'Cheque' },
  { id: 'CASH', name: 'Cash' },
  { id: 'ALLPAY', name: 'Allpay' },
  { id: 'POSTAL_ORDER', name: 'Postal order' },
  { id: 'CARD', name: 'Card' }
];

export class PaymentstateServiceMock implements IPaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes = new BehaviorSubject<IPaymentType[]>(paymentTypes);
  paymentTypeEnum = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  paymentInstructions$: Observable<IPaymentsLog[]>;

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

  getPaymentTypes(): Observable<IResponse> {
    return of({data: paymentTypes, success: true});
  }

  setPaymentInstructionsByAction(paymentAction: IPaymentAction): Observable<IPaymentsLog[]> {
    return of(getPaymentInstructions());
  }

}
