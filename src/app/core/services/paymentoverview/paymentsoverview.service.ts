import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';

@Injectable()
export class PaymentsOverviewService {
  constructor(private http: BarHttpClient) { }

  getPaymentsOverview (status: string) {
    return this.http
      .get(`${environment.apiUrl}/users/pi-stats?status=${status}`);
  }

  getRejectedPaymentsOverview (currentStatus: string, oldStatus: string) {
    return this.http
      .get(`${environment.apiUrl}/users/pi-stats?status=${currentStatus}&oldStatus=${oldStatus}`);
  }

  getPaymentStatsByUserAndStatus(userId: string, status: string) {
    return this.http
      .get(`${environment.apiUrl}/users/${userId}/payment-instructions/stats?status=${status}`);
  }

  getPaymentInstructionCount(status: string) {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/count?status=${status}`);
  }
}
