import { Injectable } from '@angular/core';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { Observable } from 'rxjs/Observable';
import { IResponse } from '../../../core/interfaces';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());

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

}
