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
    let url = '';
    switch (data.payment_type) {
      case 1:
        url = '/cheque';
      break;
      case 2:
        url = '/cash';
      break;
      case 3:
        url = '/postal-order';
      break;
      case 4:
        url = '/card';
      break;
      case 6:
        url = '/allpay';
      break;
    }

    return this.http
      .post(`${environment.apiUrl}/payments${url}`, data)
      .toPromise();
  }

}
