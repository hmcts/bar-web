import { PaymentAction } from '../models/paymentaction.model';
import { PaymentStatus } from '../models/paymentstatus.model';
import { PaymentTypeEnum } from '../models/payment.type.enum';

export interface IPaymentsLog {
  action?: PaymentAction;
  action_comment: string;
  action_reason: string;
  authorization_code?: string;
  all_pay_transaction_id?: string;
  amount?: number;
  case_fee_details?: ICaseFeeDetail[];
  cheque_number?: string;
  currency: string;
  daily_sequence_id: number;
  id: number;
  payer_name: string;
  payment_date: Date;
  payment_type: IPaymentType;
  payment_reference_id?: string;
  postal_order_number?: string;
  selected?: boolean;
  site_id: string;
  status: PaymentStatus;
  unallocated_amount?: number;

  getProperty(property: string);
  getPaymentReference(paymentTypeEnum: PaymentTypeEnum): string;
}

export interface IPaymentType {
  id: string;
  name: string;
}

export interface ICaseFeeDetail {
  amount: number;
  case_fee_id: number;
  case_reference: string;
  payment_instruction_id: number;
  fee_code: string;
  fee_description: string;
  fee_version: string;
  refund_amount?: number;
  remission_amount?: number;
  remission_authorisation?: string;
  remission_benefiter?: string;
  status?: string;
  absEquals?: Function;
  equals: Function;
  showEditableAmount: boolean;
  showFixedAmount: boolean;
  feeType: string;
}
