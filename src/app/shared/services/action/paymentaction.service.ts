import { Injectable } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Observable } from 'rxjs/Observable';
import { IResponse } from '../../../core/interfaces';

@Injectable()
export class PaymentActionService {

    constructor(private http: BarHttpClient) {
    }

    getPaymentActions(): Observable<IResponse> {
        return this.http.get('/api/payment-action');
    }
}
