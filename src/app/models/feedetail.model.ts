import { FeeSearchModel } from './feesearch.model';
import { ICaseFeeDetail } from '../interfaces/payments-log';

export class FeeDetailModel implements ICaseFeeDetail {
  amount: number;
  case_fee_id: number;
  case_reference: string;
  case_reference_id: number;
  fee_code: any;
  fee_description: string;
  fee_version: string;
  refund_amount: number;
  remission_amount: number;
  remission_authorisation: string;
  remission_benefiter: string;

  getRemissionAmount() {
    if (!this.hasOwnProperty('remission_amount') || this.remission_amount === null) {
      return '-';
    }

    return `£${(this.remission_amount / 100).toFixed(2)}`;
  }

  getAmount() {
    return `£${(this.amount / 100).toFixed(2)}`;
  }

  // @TODO: Create currentCase model
  assign(feeCodeModel: FeeSearchModel, currentCase: any) {
    this.amount = feeCodeModel.getAmount();
    this.case_reference = currentCase.id;
    this.case_reference_id = currentCase.id;
    this.fee_code = feeCodeModel.code;
    this.fee_description = feeCodeModel.current_version.description;
    this.fee_version = feeCodeModel.current_version.version;
  }

  reset() {
    this.amount = null;
    this.fee_code = '';
    this.fee_description = '';
    this.fee_version = '';
    this.remission_amount = null;
    this.remission_benefiter = '';
    this.remission_authorisation = '';
  }
}
