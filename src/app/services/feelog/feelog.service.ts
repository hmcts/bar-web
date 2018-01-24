import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class FeelogService {
  private feelogResponse: any = false;

  constructor(private http: HttpClient) { }

  getFeeLog (status): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payments-instructions?status=${status}`)
      .toPromise();
  }

  getFeeCodesAndDescriptions(code: string) {
    let url = `${environment.apiUrl}/fee-codes`;
    if (code !== '') {
      url += `?code=${code}`;
    }

    return this.http
      .get(url)
      .toPromise();
  }

  addFeeToCase(paymentInstructionId, data) {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions/${paymentInstructionId}/fees`, data)
      .toPromise();
  }
}
