import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentType } from '../../interfaces/payment-types';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PaymenttypeService {
  paymentTypesSource$ = new BehaviorSubject<IPaymentType[]>([]);

  constructor(private http: BarHttpClient,
              private _paymentStateService: PaymentstateService) {}

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
