import { Injectable } from '@angular/core';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { FeeDetailModel } from '../../models/feedetail.model';
import {ICaseFeeDetail} from '../../interfaces/payments-log';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';

@Injectable()
export class FeelogService {
  private feelogResponse: any = false;

  constructor(private http: BarHttpClient) { }

  getFeeLog (status): Promise<any> {
    return this.http
      .get(`/api/payments-instructions?status=${status}`)
      .toPromise();
  }

  getFeeCodesAndDescriptions(query: string) {
    let url = `/api/fees/search`;
    if (query) {
      url += `?query=${query}`;
      return this.http.get(url).toPromise();
    } else {
      return Promise.resolve({ found: true, fees: [], success: true });
    }
  }

  addEditFeeToCase(paymentInstructionId: string, data: ICaseFeeDetail, method = 'post') {

    return this.http[method](`/api/payment-instructions/${paymentInstructionId}/fees`, data)
    .toPromise();
  }

  sendPaymentInstructionAction(paymentInstruction: PaymentInstructionModel, paymentInstructionActionModel: PaymentInstructionActionModel) {
    return this.http
      .put(`/api/payment-instructions/${paymentInstruction.id}`, paymentInstructionActionModel)
      .toPromise();
  }

  updatePaymentModel(paymentInstruction: PaymentInstructionModel) {
    return this.http
      .put(`/api/payment-instructions/${paymentInstruction.id}`, paymentInstruction)
      .toPromise();
  }

  getUnallocatedAmount(model: PaymentInstructionModel, feeDetail: FeeDetailModel): number {
    const [feeAmount, remissionAmount, refundAmount] = this.collectFeeAmounts(feeDetail);
    const amount: number = model.getProperty('unallocated_amount');
    return amount - feeAmount + remissionAmount - refundAmount;
  }

  collectFeeAmounts(feeDetail: ICaseFeeDetail): Array<number> {
    const feeAmount: number = feeDetail.amount ? feeDetail.amount : 0;
    const remissionAmount: number = feeDetail.remission_amount ? parseFloat(feeDetail.remission_amount.toString()) : 0;
    const refundAmount: number = feeDetail.refund_amount ? parseFloat(feeDetail.refund_amount.toString()) : 0;
    return [feeAmount, remissionAmount, refundAmount];
  }

  removeFeeFromPaymentInstruction(caseFee: ICaseFeeDetail) {
    return this.http
      .delete(`/api/fees/${caseFee.case_fee_id}`)
      .toPromise();
  }

}
