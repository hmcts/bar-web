import { Injectable } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { IResponse } from '../../../core/interfaces';
import { Observable } from 'rxjs';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PaymentActionService {
  constructor(private http: BarHttpClient, private cache: CacheService) {}

  getPaymentActions(): Observable<IResponse> {
    return this.cache.get('actions', this.http.get('/api/payment-action'));
  }
}
