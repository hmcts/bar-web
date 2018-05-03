import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PaymentsOverviewService {
  constructor(private http: HttpClient) { }

  getPaymentsOverview (userRole: string) {
    return this.http
      .get(`${environment.apiUrl}/payment-stats?userRole=${userRole}`);
  }
}
