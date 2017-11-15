import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {} from '../../../environments';
import { UserService } from '../user/user.service';


@Injectable()
export class PaymenttypeService {

  constructor(private http: HttpClient) {}

  getPaymentTypes() {
    return this.http
      .get('/payment-types')
      .toPromise();
  }

  createPostPayment(data) {
    return this.http
      .post('/payments', data)
      .toPromise();
  }

}
