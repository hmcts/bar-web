export interface IPaymentsLog {
  all_pay_transaction_id?: string;
  amount: number;
  case_reference: string;
  case_references?: ICaseReference[];
  cheque_number?: string;
  currency: string;
  daily_sequence_id: number;
  id: number;
  payer_name: string;
  status: string;
  payment_date: Date;
  site_id: string;
  payment_type: IPaymentType;
  selected?: boolean;
  payment_reference_id?: string;
  postal_order_number?: string;
}

export interface IPaymentType {
  id: string;
  name: string;
}

export interface ICaseReference {
  id: number;
  case_fee_details: ICaseFeeDetail[];
  case_reference: string;
  payment_instruction_id: number;
}

export interface ICaseFeeDetail {
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
}
