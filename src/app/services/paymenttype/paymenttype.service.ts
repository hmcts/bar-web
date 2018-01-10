import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';

@Injectable()
export class PaymenttypeService {

  constructor(private http: HttpClient) {}

  getPaymentTypes() {
    return this.http
      .get(`${environment.apiUrl}/payment-types`)
      .toPromise();
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
