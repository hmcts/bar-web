import { PaymentInstructionModel } from './paymentinstruction.model';
import { IPaymentType } from '../interfaces/payment-types';
import { FeeDetailModel } from './feedetail.model';
import {CaseReferenceModel} from './casereference';

// must be used for check and submit ONLY
export class CheckAndSubmit {
  paymentId?: number;
  date?: any;
  name?: string;
  paymentType?: IPaymentType;
  paymentAmount?: number;
  caseReference: string;
  fee: string;
  remission: string;
  refund: number;
  action?: string;
  status?: string;
  checked = false;

  convertTo (paymentInstruction: PaymentInstructionModel, caseReference?: CaseReferenceModel, feeDetails?: FeeDetailModel) {
    this.paymentId = paymentInstruction.id;
    this.date = paymentInstruction.payment_date;
    this.name = paymentInstruction.payer_name;
    this.paymentType = paymentInstruction.payment_type;
    this.paymentAmount = paymentInstruction.amount;
    this.status = paymentInstruction.status;
    this.action = paymentInstruction.action;

    if (feeDetails) {
      this.caseReference = caseReference.case_reference;
      this.fee = feeDetails.getAmount();
      this.remission = feeDetails.getRemissionAmount();
      this.refund = feeDetails.refund_amount;
    }
  }

  getProperty(property: string): string {
    if (!this[property]) {
      return '-';
    }

    if (property === 'paymentAmount') {
      return `£${this[property]}`;
    }

    return this[property];
  }

  removeDuplicateProperties() {
    this.paymentId = null;
    this.date = null;
    this.name = null;
    this.paymentType = null;
    this.paymentAmount = null;
    this.status = '-';
    this.action = '-';
  }

}
