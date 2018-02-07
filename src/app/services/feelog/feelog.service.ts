import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FeeLogModel } from '../../models/feelog.model';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { FeeDetailModel } from '../../models/feedetail.model';

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
    let url = `${environment.apiUrl}/fees/search`;
    if (code !== '') {
      url += `?code=${code}`;
    }

    return this.http
      .get(url)
      .toPromise();
  }

  addFeeToCase(paymentInstructionId, data: FeeDetailModel) {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions/${paymentInstructionId}/fees`, data)
      .toPromise();
  }

  sendPaymentInstructionAction(paymentLog: FeeLogModel, paymentInstructionActionModel: PaymentInstructionActionModel) {
    return this.http
      .patch(`${environment.apiUrl}/payment-instructions/${paymentLog.id}`, paymentInstructionActionModel)
      .toPromise();
  }
}
