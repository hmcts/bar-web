import {PaymentInstructionModel} from './paymentinstruction.model';
import {IPaymentType} from '../interfaces/payment-types';
import {FeeDetailModel} from './feedetail.model';
import {PaymentAction} from './paymentaction.model';
import {PaymentStatus} from './paymentstatus.model';
import {FormatPound} from '../../shared/pipes/format-pound.pipe';
import { ICheckAndSubmit } from '../interfaces/check-and-submit';

// must be used for check and submit ONLY
export class CheckAndSubmit implements ICheckAndSubmit {
  paymentId?: number;
  date?: any;
  dailySequenceId: number;
  name?: string;
  paymentType?: IPaymentType;
  paymentAmount?: number;
  bgcNumber?: string;
  caseReference: string;
  fee: number;
  remission: number;
  refund: number;
  siteId: string;
  action?: string;
  status?: PaymentStatus;
  checked = false;
  formatter: FormatPound;
  currency: string;

  // payment references
  allPayTransactionId: string;
  authorizationCode: string;
  chequeNumber: string;
  postalOrderNumber: string;

  // temporary properties for display
  separatorNeeded?: boolean;

  convertTo(paymentInstruction: PaymentInstructionModel, feeDetails?: FeeDetailModel) {
    this.formatter = new FormatPound();
    this.paymentId = paymentInstruction.id;
    this.date = paymentInstruction.payment_date;
    this.name = paymentInstruction.payer_name;
    this.paymentType = paymentInstruction.payment_type;
    this.paymentAmount = this.formatter.transform(paymentInstruction.amount);
    this.paymentAmount = paymentInstruction.amount;
    this.status = paymentInstruction.status;
    this.action = paymentInstruction.action;
    this.dailySequenceId = paymentInstruction.daily_sequence_id;
    this.siteId = paymentInstruction.site_id;
    this.currency = paymentInstruction.currency;

    // set up the payment fields
    this.allPayTransactionId = paymentInstruction.all_pay_transaction_id;
    this.authorizationCode = paymentInstruction.authorization_code;
    this.chequeNumber = paymentInstruction.cheque_number;
    this.postalOrderNumber = paymentInstruction.postal_order_number;

    if (feeDetails) {
      this.caseReference = feeDetails.case_reference;
      this.fee = feeDetails.amount;
      this.remission = feeDetails.remission_amount;
      // this.fee = this.formatter.transform(feeDetails.amount);
      // this.remission = this.formatter.transform(feeDetails.remission_amount);
      this.refund = feeDetails.refund_amount;
    }
    return this;
  }

  getProperty(property: string) {
    if (!this[property]) {
      return '';
    }
    return this[property];
  }

  removeDuplicateProperties() {
    this.dailySequenceId = null;
    this.paymentId = null;
    this.date = null;
    this.name = null;
    this.paymentType = null;
    this.paymentAmount = null;
    this.status = '';
    this.action = '';
  }

}
