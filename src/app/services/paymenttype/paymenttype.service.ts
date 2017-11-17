import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymenttypeService {

  constructor(private http: HttpClient) {}

  getPaymentTypes() {
    return this.http
      .get(`${environment.apiUrl}/payment-types`)
      .toPromise();
  }

  createPostPayment(data) {
    let paymentType = 'cheque';

    switch (data.payment_type) {
      case 1:
      paymentType = 'cheque';
      break;

      case 2:
      paymentType = 'cash';
      break;

      case 3:
      paymentType = 'postal-order';
      break;

      case 4:
      paymentType = 'card';
      break;

      case 6:
      paymentType = 'allpay';
      break;
    }

    return this.http
      .post(`${environment.apiUrl}/payments/${paymentType}`, data)
      .toPromise();
  }

}
