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
    switch (data.payment_type) {
      case 1:
      data.payment_type = 'cheques';
      break;

      case 3:
      data.payment_type = 'cards';
      break;

      case 4:
      data.payment_type = 'postal-orders';
      break;

      case 5:
      data.payment_type = 'cash';
      break;

      case 6:
      data.payment_type = 'allpay';
      break;
    }

    return this.http
      .post(`${environment.apiUrl}/payments/${data.payment_type}`, data)
      .toPromise();
  }

}
