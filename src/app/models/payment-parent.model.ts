import { IPaymentType } from '../interfaces/payment-types';
import { ICaseReference } from '../interfaces/payments-log';

export class PaymentParent {
  id: number;
  payer_name: string;
  case_reference: string;
  case_references?: ICaseReference[];
  amount: number;
  currency: string;
  status: string;
  payment_date: Date;
  payment_reference?: string;
  site_id: string;
  daily_sequence_id: number;
  payment_type: any;
  cheque_number?: string;
  all_pay_transaction_id?: string;
  postal_order_number?: string;
  selected?: boolean;
}
