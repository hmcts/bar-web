export interface IPaymentsLog {
  id: number;
  payer_name: string;
  amount: string;
  currency: string;
  status: string;
  payment_date: Date;
  site_id: string;
  daily_sequence_id: number;
  payment_type: any;
  selected?: boolean;
  payment_reference_id?: string;
  cheque_number?: string;
  postal_order_number?: string;
  all_pay_transaction_id?: string;
}
