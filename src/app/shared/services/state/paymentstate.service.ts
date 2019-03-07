import { Injectable } from '@angular/core';
import { IPaymentsLog, IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { IResponse } from '../../../core/interfaces';
import { map } from 'rxjs/operators';
import { IPaymentstateService } from './paymentstate.service.interface';
import { IPaymentAction } from '../../../core/interfaces/payment-actions';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PaymentStateService implements IPaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  selectedPaymentAction$: BehaviorSubject<IPaymentAction>;
  paymentTypes$: Observable<IPaymentType[]>;

  constructor(private http: BarHttpClient, private cacheService: CacheService) {
    console.log('state initialised');
    this.getPaymentTypes()
      .pipe(map((data: IResponse) => <IPaymentType[]>data.data))
      .subscribe(pTypes => this.paymentTypes.next(pTypes));

    this.setPaymentTypeEnum(this.paymentTypes)
      .subscribe(ptEnum => this.paymentTypeEnum.next(ptEnum));

    this.selectedPaymentAction$ = new BehaviorSubject({ action: 'Process' });
    this.paymentTypes$ = this.getPaymentTypes().pipe(map((response: IResponse) => response.data));
  }

  // start: http methods -----------------------------------------------------
  getPaymentActions(): Observable<any> {
    return this.cacheService.get('actions', this.http.get('/api/payment-action'))
      .pipe(map((response: IResponse) => {
        return response.data;
      }));
  }

  getPaymentTypes(): Observable<IResponse> {
    return this.cacheService.get('types', this.http.get(`/api/payment-types`));
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

  setPaymentInstructionsByAction(paymentAction: IPaymentAction): Observable<IPaymentsLog[]> {
    return this.http.get(`/api/payment-instructions?action=${paymentAction.action}`);
  }
}
