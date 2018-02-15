import { ICaseFeeDetail } from '../interfaces/payments-log';

export class CaseFeeDetailModel implements ICaseFeeDetail {
  amount: number;
  case_fee_id: number;
  case_reference: string;
  case_reference_id: number;
  fee_code: string;
  fee_description: string;
  fee_version: string;
  refund_amount?: number;
  remission_amount?: number;
  remission_authorisation?: string;
  remission_benefiter?: string;

  assign(caseFeeDetail) {
    const properties = Object.keys(caseFeeDetail);
    for (let i = 0; i < properties.length; i++) {
      this[properties[i]] = caseFeeDetail[properties[i]];
    }
  }

  getRemissionAmount() {
    if (!this.hasOwnProperty('remission_amount') || this.remission_amount === null) {
      return '-';
    }

    return `£${(this.remission_amount / 100).toFixed(2)}`;
  }

  getAmount() {
    return `£${(this.amount / 100).toFixed(2)}`;
  }

}
