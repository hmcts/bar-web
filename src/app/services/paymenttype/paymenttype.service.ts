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
    let paymentTypeUri = 'cheques';

    switch (data.payment_type) {
      case 1:
      paymentTypeUri = 'cheques';
      break;

      case 3:
      paymentTypeUri = 'cards';
      break;

      case 4:
      paymentTypeUri = 'postal-orders';
      break;

      case 5:
      paymentTypeUri = 'cash';
      break;

      case 6:
      paymentTypeUri = 'allpay';
      break;
    }

    return this.http
      .post(`${environment.apiUrl}/payments/${paymentTypeUri}`, data)
      .toPromise();
  }

}
