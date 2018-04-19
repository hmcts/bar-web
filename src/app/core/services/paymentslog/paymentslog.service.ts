import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { CaseReference } from '../../models/case-reference';
import { ApiroutesService } from '../../../shared/services/apiroutes/apiroutes.service';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';

@Injectable()
export class PaymentslogService {

  constructor(private http: HttpClient) { }

  getPaymentsLog (status?: PaymentStatus): Promise<any> {
    let params = '';
    if (typeof status !== 'undefined') {
      params = `?status=${status}`;
    }
    return this.http
      .get(`${environment.apiUrl}/payment-instructions${params}`)
      .toPromise();
  }

  getPaymentInstructionByUserId(userModel: UserModel, paymentStatus?) {
    let params = ``;
    if (paymentStatus) {
      params = `?status=${paymentStatus}`;
    }

    return this.http
      .get<IResponse>(`${ApiroutesService.routes.userPaymentInstructions.replace(':id', userModel.id)}${params}`);
  }

  getPaymentById (paymentID: number): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/${paymentID}`)
      .toPromise();
  }

  getUnallocatedAmount (paymentID: number): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/${paymentID}/unallocated`)
      .toPromise();
  }

  sendPendingPayments (data): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions`, data)
      .toPromise();
  }

  deletePaymentLogById (paymentID: number): Promise<any> {
    return this.http
      .delete(`${environment.apiUrl}/payment-instructions/${paymentID}`)
      .toPromise();
  }

  createCaseNumber (caseReferenceModel: CaseReference): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions/${caseReferenceModel.paymentInstructionId}/cases`, {
        case_reference: caseReferenceModel.caseReference
      })
      .toPromise();
  }

  searchPayments (searchString: string): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/search?q=${searchString}`)
      .toPromise();
  }

  searchPaymentsByDate(userModel: UserModel, searchModel: SearchModel) {
    const params = [];

    for (const property in searchModel) {

      // exclude properties that has a value of "All"
      if (searchModel[property] !== 'All' && searchModel[property] !== '') {
        params.push(`${property}=${searchModel[property]}`);
      }

    }

    return this.http
      .get(`${environment.apiUrl}/users/${userModel.id}/payment-instructions/search?${params.join('&')}`)
      .toPromise();
  }

  getPaymentsLogCsvReport(): Promise<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'text/csv');
    console.log( httpHeaders.get('Content-Type') );

    return this.http
      .get(`${environment.apiUrl}/payment-instructions?format=csv`, { headers: httpHeaders })
      .toPromise();
  }

}
