import { Injectable } from '@angular/core';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BehaviorSubject } from 'rxjs';
import { IPaymentType } from '../../interfaces/payment-types';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Observable, Subject } from 'rxjs';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';

@Injectable()
export class PaymenttypeService {
  paymentTypesSource$ = new BehaviorSubject<IPaymentType[]>([]);

  constructor(private http: BarHttpClient, private _paymentStateService: PaymentStateService) {}

  getPaymentTypes(): Subject<IPaymentType[]> {
    return this._paymentStateService.paymentTypes;
  }

  // TODO: Move to it's place in PaymentIstructionService
  savePaymentModel(data: PaymentInstructionModel): Observable<any> {
    let paymentType = data.payment_type;

    if (typeof paymentType === 'object') {
      paymentType = data.payment_type.id;
    }
    paymentType = this._paymentStateService.paymentTypeEnum.getValue().getEndpointUri(paymentType);
    return this.http.post(`/api/payment/${paymentType}`, data);
  }

}
