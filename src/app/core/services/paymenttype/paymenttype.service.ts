import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentType } from '../../interfaces/payment-types';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';

@Injectable()
export class PaymenttypeService {
  paymentTypesSource$ = new BehaviorSubject<IPaymentType[]>([]);

  constructor(private http: BarHttpClient,
              private _paymentStateService: PaymentstateService) {}

  getPaymentTypes() {
    return this.http
      .get(`${environment.apiUrl}/payment-types`)
      .toPromise();
  }

  setPaymentTypeList(data: IPaymentType[]): void {
    this.paymentTypesSource$.next(data);
  }

  // TODO: Move to it's place in PaymentIstructionService
  async savePaymentModel(data: PaymentInstructionModel): Promise<any> {
    let paymentType = data.payment_type;

    if (typeof paymentType === 'object') {
      paymentType = data.payment_type.id;
    }

    const paymentTypeEnum = await this._paymentStateService.paymentTypeEnum;

    paymentType = paymentTypeEnum.getEndpointUri(paymentType);

    return this.http
      .post(`${environment.apiUrl}/payment/${paymentType}`, data)
      .toPromise();
  }

}
