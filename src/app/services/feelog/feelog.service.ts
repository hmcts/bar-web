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

  getFeeCodesAndDescriptions() {
    return this.http
      .get(`${environment.apiUrl}/fee-codes`)
      .toPromise();
  }
}
