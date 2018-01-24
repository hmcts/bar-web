import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentType } from '../../interfaces/payment-types';

@Injectable()
export class PaymenttypeService {
  paymentTypesSource = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {}

  getPaymentTypes() {
    return this.http
      .get(`${environment.apiUrl}/payment-types`)
      .toPromise();
  }

  setPaymentTypeList(data: IPaymentType[]): void {
    this.paymentTypesSource.next(data);
  }

  savePaymentModel(data: PaymentInstructionModel): Promise<any> {
    let paymentType = data.payment_type;

    if (typeof paymentType === 'object') {
      paymentType = data.payment_type.id;
    }

    return this.http
      .post(`${environment.apiUrl}/payment/${paymentType}`, data)
      .toPromise();
  }

  updatePaymentModel(data: PaymentInstructionModel) {
    const paymentType = data.payment_type;
    delete data.payment_type;

    return this.http
      .put(`${environment.apiUrl}/payment/${paymentType}`, data)
      .toPromise();
  }

}
