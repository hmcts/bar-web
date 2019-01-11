import { PaymentAction } from './paymentaction.model';
import { ICaseFeeDetail } from '../interfaces/payments-log';
import { CaseFeeDetailModel } from './casefeedetail';
import { PaymentTypeEnum } from './payment.type.enum';

export class PaymentCaseReference {
  case_reference: string;
  id: number;
  payment_instruction_id: number;
  case_fee_details?: ICaseFeeDetail[];
}

export class PaymentParent {
  action?: PaymentAction;
  id: number;
  payer_name: string;
  case_fee_details?: Array<CaseFeeDetailModel>;
  amount: number;
  currency: string;
  status: any; // @TODO: This needs to be refactored to accomodate only strings
  payment_date: Date;
  payment_reference?: string;
  site_id: string;
  daily_sequence_id: number;
  payment_type: any;
  selected?: boolean;

  // payment references
  all_pay_transaction_id?: string;
  authorization_code?: string;
  cheque_number?: string;
  postal_order_number?: string;
  remission_reference?: string;

  getProperty(property: string) {
    if (!this.hasOwnProperty(property)) {
      return '';
    }

    if (property === 'unallocated_amount') {
     return (this[property] / 100);
    }

    return this[property];
  }

  isEmpty(key): boolean {
    if (this[key] && this[key].length > 0) {
      return false;
    }

    return true;
  }

}
