import { FeeSearchModel } from './feesearch.model';
import { ICaseFeeDetail } from '../interfaces/payments-log';

export class FeeDetailModel implements ICaseFeeDetail {

  static STATUS_DISABLED = 'disabled';

  amount: number;
  case_fee_id: number;
  case_reference: string;
  payment_instruction_id: number;
  fee_code: any;
  fee_description: string;
  fee_version: string;
  refund_amount?: number;
  remission_amount?: number;
  remission_authorisation?: string;
  remission_benefiter?: string;

  assign(model: any) {
    const properties = Object.keys(model);
    for (let i = 0; i < properties.length; i++) {
      this[properties[i]] = model[properties[i]];
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
    this.refund_amount = null;
  }

  equals(other: ICaseFeeDetail) {
    if (other === null) {
      return false;
    }
    return this.case_reference === other.case_reference &&
      this.payment_instruction_id === other.payment_instruction_id &&
      this.amount === other.amount &&
      this.remission_amount === other.remission_amount &&
      this.remission_authorisation === other.remission_authorisation &&
      this.remission_benefiter === other.remission_benefiter &&
      this.refund_amount === other.refund_amount &&
      this.fee_code === other.fee_code &&
      this.fee_description === other.fee_description;
  }

  absEquals(other: ICaseFeeDetail) {
    if (other === null) {
      return false;
    }
    return this.case_reference === other.case_reference &&
      this.payment_instruction_id === other.payment_instruction_id &&
      this.checkIfValueAbsEqualButNegate(this.amount, other.amount) &&
      this.checkIfValueAbsEqualButNegate(this.remission_amount, other.remission_amount) &&
      this.checkIfValueAbsEqualButNegate(this.refund_amount, other.refund_amount) &&
      this.fee_code === other.fee_code &&
      this.fee_description === other.fee_description;
  }

  private checkIfValueAbsEqualButNegate(thisValue: number, otherValue: number) {
    if (thisValue == null && otherValue == null) {
      return true;
    }
    if (thisValue === otherValue) {
      return false;
    } else {
      return  Math.abs(thisValue) === Math.abs(otherValue);
    }
  }
}
