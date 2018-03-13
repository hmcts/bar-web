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
  refund_amount?: number;
  remission_amount?: number;
  remission_authorisation?: string;
  remission_benefiter?: string;

  getRemissionAmount() {
    if (!this.hasOwnProperty('remission_amount') || this.remission_amount === null) {
      return '-';
    }

    return `£${(this.remission_amount).toFixed(2)}`;
  }

  getAmount() {
    return `£${(this.amount).toFixed(2)}`;
  }

  // @TODO: Create currentCase model
  assign(model: FeeSearchModel, currentCase?: any) {
    this.case_fee_id = undefined;
    if (arguments.length > 1) {
      this.amount = model.getAmount();
      this.case_reference = currentCase.id;
      this.fee_code = model.code;
      this.case_reference_id = currentCase.id;
      this.fee_version = model.current_version.version;
      this.fee_description = model.current_version.description;
    } else {
      const properties = Object.keys(model);
      for (let i = 0; i < properties.length; i++) {
        this[properties[i]] = model[properties[i]];
      }
    }
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
