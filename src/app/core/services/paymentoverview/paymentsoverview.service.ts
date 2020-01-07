import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BarHttpClient} from '../../../shared/services/httpclient/bar.http.client';
import {isUndefined} from 'lodash';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {IResponse} from '../../interfaces';


@Injectable()
export class PaymentsOverviewService {
  constructor(private http: BarHttpClient) { }

  getPaymentsOverview (status: string) {
    return this.http
      .get(`/api/users/pi-stats?status=${status}`);
  }

  getRejectedPaymentsOverview (currentStatus: string, oldStatus: string) {
    return this.http
      .get(`/api/users/pi-stats?status=${currentStatus}&oldStatus=${oldStatus}`);
  }

  getPaymentStatsByUserAndStatus(userId: string, status: string, oldStatus?: string): Observable<any> {
    let queryParam = `?status=${status}`;
    if (oldStatus) {
      queryParam += `&old_status=${oldStatus}`;
    }
    return this.http
      .get(`/api/users/${userId}/payment-instructions/stats${queryParam}`);
  }

  getPaymentInstructionCount(status: string, startDate?: string, endDate?: string): Observable<IResponse> {
    const dates = (isUndefined(startDate) && isUndefined(endDate))
      ? ''
      : `&startDate=${ moment(startDate).format('DDMMYYYY') }&endDate=${ moment(endDate).format('DDMMYYYY') }`;
    return this.http
      .get(`/api/payment-instructions/count?status=${status}${dates}`);
  }

  getRecordedData(status: string, startDate?: string, endDate?: string) {
    const dates = (isUndefined(startDate) && isUndefined(endDate))
      ? ''
      : `&startDate=${ moment(startDate).format('DDMMYYYY') }&endDate=${ moment(endDate).format('DDMMYYYY') }`;
    return this.http
      .get(`/api/users/pi-stats/count?status=${status}${dates}`);
  }

}
