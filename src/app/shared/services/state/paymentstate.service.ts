import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { PaymentTypeEnum } from '../../../core/models/payment.type.enum';
import { IResponse } from '../../../core/interfaces';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class PaymentstateService {

  currentOpenedFeeTab = 1;
  paymentTypes: Promise<IPaymentType[]>;
  paymentTypeEnum: Promise<PaymentTypeEnum>;

  constructor(private http: BarHttpClient) {
    console.log('state initialised');
    this.paymentTypes = this.setPaymentTypes();
    this.paymentTypeEnum = this.setPaymentTypeEnum(this.paymentTypes);
  }

  setPaymentTypes() {
    return this.getPaymentTypes()
      .then((data: IResponse) => data.data);
  }

  setPaymentTypeEnum(data: Promise<IPaymentType[]>) {
    return new Promise<PaymentTypeEnum>((resolve, reject) => {
      data.then(pTypes => {
    const ptEnum = new PaymentTypeEnum();
        ptEnum.configure(pTypes);
        resolve(ptEnum);
      });
    });
  }

  setCurrentOpenedFeeTab(currentTab: number) {
    this.currentOpenedFeeTab = currentTab;
  }

  getPaymentTypes() {
    return this.http
      .get(`${environment.apiUrl}/payment-types`)
      .toPromise();
  }

}
