import {PaymentAction} from '../models/paymentaction.model';
import {PaymentStatus} from '../models/paymentstatus.model';

export interface IPaymentsLog {
  action?: PaymentAction;
  action_comment: string;
  action_reason: string;
  authorization_code?: string;
  all_pay_transaction_id?: string;
  amount?: number;
  case_fee_details?: ICaseFeeDetail[];
  payhub_references?: IPayhubReference[];
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
  pageNumber?:number;
  recordsPerPage?:number;
  unallocated_amount?: number;

  getProperty(property: string);
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

export interface IPayhubReference {
  id: number;
  payment_instruction_id: number;
  reference: string;
  payment_group_reference: string;
}
