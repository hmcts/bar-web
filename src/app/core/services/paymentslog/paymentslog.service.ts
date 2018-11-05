import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { IResponse } from '../../interfaces';
import { isUndefined } from 'lodash';

@Injectable()
export class PaymentslogService {
  constructor(private http: BarHttpClient) {}

  getPaymentsLog(userModel: UserModel, status?: PaymentStatus, startDate?: string, endDate?: string): Promise<any> {
    let params = '?';
    params = (!isUndefined(status)) ? `${params}status=${status}` : params;
    params = (!isUndefined(startDate)) ? `${params}&startDate=${startDate}` : params;
    params = (!isUndefined(endDate)) ? `${params}&endDate=${endDate}` : params;

    return this.http
      .get(`/api/users/${userModel.id}/payment-instructions${params}`)
      .toPromise();
  }

  getPaymentsLogByUser(searchModel: SearchModel): Observable<IResponse> {
    const keysToOmit = ['id'];
    const parameters = Object.keys(searchModel)
      .filter((key: string) => !keysToOmit.includes(key))
      .map((key: string) => `${key}=${searchModel[key]}`)
      .join('&');
    const endPoint = `/api/users/${searchModel.id}/payment-instructions?${parameters}`;

    return this.http
      .get(`${endPoint}`);
  }

  getAllPaymentInstructions(status?: PaymentStatus[]): Observable<any> {
    let params = '';
    params = !isUndefined(status) ? `?status=${status.join(',')}` : '';

    return this.http
      .get(`/api/payment-instructions${params}`);
  }

  getPaymentById(paymentID: number): Promise<any> {
    return this.http
      .get(`/api/payment-instructions/${paymentID}`)
      .toPromise();
  }

  getUnallocatedAmount(paymentID: number): Promise<any> {
    return this.http
      .get(`/api/payment-instructions/${paymentID}/unallocated`)
      .toPromise();
  }

  sendPendingPayments(data): Promise<any> {
    return this.http
      .post(`/api/payment-instructions`, data)
      .toPromise();
  }

  deletePaymentLogById(paymentID: number): Observable<any> {
    return this.http
      .delete(`/api/payment-instructions/${paymentID}`);
  }

  rejectPaymentInstruction(paymentID: number): Observable<any> {
    return this.http
      .patch(`/api/reject-payment-instruction/${paymentID}`, null);
  }

  searchPayments(searchString: string): Promise<any> {
    return this.http
      .get(`/api/payment-instructions/search?q=${searchString}`)
      .toPromise();
  }

  searchPaymentsByDate(searchModel: SearchModel) {
    const params = [];

    for (const property in searchModel) {
      if (searchModel[property] !== 'All' && searchModel[property] !== '') {
        params.push(`${property}=${searchModel[property]}`);
      }
    }

    return this.http
      .get(`/api/payment-instructions/search?${params.join('&')}`)
      .toPromise();
  }

  getPaymentsLogCsvReport(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'text/csv');

    return this.http
      .get(`/api/payment-instructions?format=csv`, { headers })
      .toPromise();
  }
}
