import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';

@Injectable()
export class PaymentsOverviewService {
  constructor(private http: BarHttpClient) { }

  getPaymentsOverview (userRole: string, status: string) {
    return this.http
      .get(`${environment.apiUrl}/payment-stats?userRole=${userRole}&status=${status}`);
  }
}
