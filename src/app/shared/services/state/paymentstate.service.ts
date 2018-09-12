import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { Observable } from 'rxjs/Observable';
import { IResponse } from '../../../core/interfaces';

@Injectable()
export class PaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: Observable<IPaymentType[]>;
  paymentTypeEnum: Observable<PaymentTypeEnum>;

  constructor(private http: BarHttpClient) {
    console.log('state initialised');
    this.paymentTypes = this.getPaymentTypes().map(data => {
      return <IPaymentType[]>data.data;
    });
    this.paymentTypeEnum = this.setPaymentTypeEnum(this.paymentTypes);
  }

  setPaymentTypeEnum(data: Observable<IPaymentType[]>): Observable<PaymentTypeEnum> {
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
