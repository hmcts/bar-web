import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentType } from '../../interfaces/payment-types';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { PaymentTypeEnum } from '../../models/payment.type.enum';

@Injectable()
export class PaymenttypeService {
  paymentTypesSource$ = new BehaviorSubject<IPaymentType[]>([]);

  constructor(private http: BarHttpClient,
              private _paymentStateService: PaymentstateService) {}

  getPaymentTypes() {
    return this.http
      .get(`/api/payment-types`)
      .toPromise();
  }

  setPaymentTypeList(data: IPaymentType[]): void {
    this.paymentTypesSource$.next(data);
  }

  // TODO: Move to it's place in PaymentIstructionService
  savePaymentModel(data: PaymentInstructionModel): Observable<any> {
    let paymentType = data.payment_type;

    if (typeof paymentType === 'object') {
      paymentType = data.payment_type.id;
    }

    return this._paymentStateService.paymentTypeEnum.pipe(mergeMap<PaymentTypeEnum, any>(val => {
      paymentType = val.getEndpointUri(paymentType);
      return this.http
        .post(`/api/payment/${paymentType}`, data);
    }));
  }

}
