import {Injectable} from '@angular/core';
import {IPaymentType} from '../../../core/interfaces/payments-log';
import {PaymentTypeEnum} from '../../../core/models/payment.type.enum';
import {BarHttpClient} from '../httpclient/bar.http.client';
import {Observable} from 'rxjs/Observable';
import {IResponse} from '../../../core/interfaces';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IPaymentAction} from '../../../core/interfaces/payment-actions';
import {map} from 'rxjs/operators';

@Injectable()
export class PaymentStateService {
  currentOpenedFeeTab = 1;
  paymentTypes: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  paymentActions$: Observable<IPaymentAction[]>;

  constructor(private http: BarHttpClient) {
    console.log('state initialised');
    this.getPaymentTypes().map(data => {
      return <IPaymentType[]>data.data;
    }).subscribe(pTypes => {
      this.paymentTypes.next(pTypes);
    });

    this.setPaymentTypeEnum(this.paymentTypes).subscribe(ptEnum => {
      this.paymentTypeEnum.next(ptEnum);
    });

    // assign payment instructions to the response
    this.paymentActions$ = this.initializePaymentActions();
  }

  setPaymentTypeEnum(data: Subject<IPaymentType[]>): Observable<PaymentTypeEnum> {
    return data.map(pTypes => {
      const ptEnum = new PaymentTypeEnum();
      ptEnum.configure(pTypes);
      return ptEnum;
    });
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
}
