import { FeeSearchModel } from './feesearch.model';
import { ICaseFeeDetail } from '../interfaces/payments-log';

export class FeeDetailModel implements ICaseFeeDetail {

  static STATUS_DISABLED = 'disabled';

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

  // @TODO: Create currentCase model
  assignFeeCase(model: FeeSearchModel, currentCase: any) {
    this.case_fee_id = undefined;
    if (arguments.length > 1) {
      this.amount = model.getAmount();
      this.case_reference = currentCase.id;
      this.fee_code = model.code;
      this.case_reference_id = currentCase.id;
      this.fee_version = model.current_version.version;
      this.fee_description = model.current_version.description;
    }
  }

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

  absEquals(other: ICaseFeeDetail) {
    return this.case_reference_id === other.case_reference_id &&
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
