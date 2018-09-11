import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { IResponse } from '../../interfaces';
import { isUndefined } from 'lodash';

// TODO: Should be decided to use promise or Observable but both is confusing
@Injectable()
export class PaymentslogService {
  constructor(private http: BarHttpClient) {}

  getPaymentsLog(userModel: UserModel, status?: PaymentStatus): Promise<any> {
    let params = '';
    if (typeof status !== 'undefined') {
      params = `?status=${status}`;
    }

    return this.http
      .get(
        `${environment.apiUrl}/users/${
          userModel.id
        }/payment-instructions${params}`
      )
      .toPromise();
  }

  getPaymentsLogByUser (searchModel: SearchModel): Observable<IResponse> {
    let params = '';
    let endPoint = '';
    if (!isUndefined(searchModel.status)) {
      params = `?status=${searchModel.status}`;
    }
    if (!isUndefined(searchModel.paymentType)) {
      params += `&paymentType=${searchModel.paymentType}`;
    }
    if (!isUndefined(searchModel.piIds)) {
      if (params) {
        params += `&piIds=${searchModel.piIds}`;
      } else {
        params += `?piIds=${searchModel.piIds}`;
      }
    }
    if (!isUndefined(searchModel.bgcNumber)) {
      params += `&bgcNumber=${searchModel.bgcNumber}`;
    }

    endPoint = `${environment.apiUrl}/users/${searchModel.id}/payment-instructions${params}`;

    return this.http
      .get(`${endPoint}`);
  }

  getAllPaymentInstructions(status?: PaymentStatus[]): Observable<any> {
    let params = '';
    if (typeof status !== 'undefined') {
      params = `?status=${status.join(',')}`;
    }
    return this.http.get(`${environment.apiUrl}/payment-instructions${params}`);
  }

  getPaymentById(paymentID: number): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/${paymentID}`)
      .toPromise();
  }

  getUnallocatedAmount(paymentID: number): Promise<any> {
    return this.http
      .get(
        `${environment.apiUrl}/payment-instructions/${paymentID}/unallocated`
      )
      .toPromise();
  }

  sendPendingPayments(data): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions`, data)
      .toPromise();
  }

  deletePaymentLogById(paymentID: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/payment-instructions/${paymentID}`
    );
  }

  rejectPaymentInstruction(paymentID: number): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/reject-payment-instruction/${paymentID}`,
      null
    );
  }

  searchPayments(searchString: string): Promise<any> {
    return this.http
      .get(
        `${environment.apiUrl}/payment-instructions/search?q=${searchString}`
      )
      .toPromise();
  }

  searchPaymentsByDate(searchModel: SearchModel) {
    const params = [];

    for (const property in searchModel) {
      // exclude properties that has a value of "All"
      if (searchModel[property] !== 'All' && searchModel[property] !== '') {
        params.push(`${property}=${searchModel[property]}`);
      }
    }

    console.log(
      `URL: ${environment.apiUrl}/payment-instructions/search?${params.join(
        '&'
      )}`
    );

    return this.http
      .get(
        `${environment.apiUrl}/payment-instructions/search?${params.join('&')}`
      )
      .toPromise();
  }

  getPaymentsLogCsvReport(): Promise<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'text/csv');

    return this.http
      .get(`${environment.apiUrl}/payment-instructions?format=csv`, {
        headers: httpHeaders
      })
      .toPromise();
  }
}
