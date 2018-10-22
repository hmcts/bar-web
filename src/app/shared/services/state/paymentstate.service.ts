import { Injectable } from '@angular/core';
import {IPaymentsLog, IPaymentType} from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IResponse } from '../../../core/interfaces';
import { map } from 'rxjs/operators';
import { IPaymentstateService } from './paymentstate.service.interface';
import { IPaymentAction } from '../../../core/interfaces/payment-actions';

@Injectable()
export class PaymentStateService implements IPaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  paymentActions$: Observable<IPaymentAction[]>;
  paymentInstructions$: Observable<IPaymentsLog[]>;

  constructor(private http: BarHttpClient) {
    console.log('state initialised');
    this.getPaymentTypes()
      .pipe(map((data: IResponse) => <IPaymentType[]>data.data))
      .subscribe(pTypes => this.paymentTypes.next(pTypes));

    this.setPaymentTypeEnum(this.paymentTypes)
      .subscribe(ptEnum => this.paymentTypeEnum.next(ptEnum));

    // assign payment instructions to the response
    this.paymentActions$ = this.initializePaymentActions();
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

  getPaymentTypes(): Observable<IResponse> {
    return this.http
      .get(`/api/payment-types`);
  }

  initializePaymentActions(): Observable<IPaymentAction[]> {
    return this.http.get('/api/payment-action')
      .pipe(map((response: IResponse) => response.data));
  }

  setPaymentInstructionsByAction(paymentAction: IPaymentAction): Observable<IPaymentsLog[]> {
    return this.http.get(`/api/payment-instructions?action=${paymentAction.action}`);
  }
}
