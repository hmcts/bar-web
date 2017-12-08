import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymentslogService {

  constructor(private http: HttpClient) { }

  getPaymentsLog (): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payments-log`)
      .toPromise();
  }

  getPaymentById (paymentID: number): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instruction/${paymentID}`)
      .toPromise();
  }

  sendPendingPayments (data): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions`, data)
      .toPromise();
  }

  deletePaymentLogById (paymentID: number): Promise<any> {
    return this.http
      .delete(`${environment.apiUrl}/payment-instruction/${paymentID}`)
      .toPromise();
  }
}
