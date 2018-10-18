import { Injectable } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { IResponse } from '../../../core/interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentActionService {
  constructor(private http: BarHttpClient) {}

  getPaymentActions(): Observable<IResponse> {
    return this.http.get('/api/payment-action');
  }
}
