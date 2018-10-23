import { Injectable } from '@angular/core';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IResponse } from '../../../core/interfaces';
import { map } from 'rxjs/operators';
import { IPaymentstateService } from './paymentstate.service.interface';
import {IPaymentAction} from '../../../core/interfaces/payment-actions';

@Injectable()
export class PaymentstateService implements IPaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  paymentActions$: Observable<IPaymentAction>;
  selectedPaymentAction$: BehaviorSubject<IPaymentAction>;

  constructor(private http: BarHttpClient) {
    this.getPaymentTypes()
      .pipe(map(data => <IPaymentType[]>data.data))
      .subscribe(pTypes => this.paymentTypes.next(pTypes));

    this.setPaymentTypeEnum(this.paymentTypes)
      .subscribe(ptEnum => this.paymentTypeEnum.next(ptEnum));

    // assign payment actions
    this.paymentActions$ = this.getPaymentActions();
    this.selectedPaymentAction$ = new BehaviorSubject({ action: 'Process' });
  }

  // start: http methods -----------------------------------------------------
  getPaymentTypes(): Observable<IResponse> {
    return this.http
      .get(`/api/payment-types`);
  }

  getPaymentActions() {
    return this.http.get('/api/payment-action')
      .pipe(map((response: IResponse) => {
        return response.data;
      }));
  }
  // end: http methods -----------------------------------------------------
  setPaymentTypeEnum(data: Subject<IPaymentType[]>): Observable<PaymentTypeEnum> {
    return data.pipe(map(pTypes => {
      const ptEnum = new PaymentTypeEnum();
      ptEnum.configure(pTypes);
      return ptEnum;
    }));
  }

  setCurrentOpenedFeeTab(currentTab: number): void {
    this.currentOpenedFeeTab = currentTab;
  }

  switchPaymentAction(action: IPaymentAction): void {
    this.selectedPaymentAction$.next(action);
  }

}
