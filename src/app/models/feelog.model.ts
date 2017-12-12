import { IPaymentsLog } from './../interfaces/payments-log';

export class FeeLogModel implements IPaymentsLog {
  id: number;
  payer_name: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: Date;
  payment_reference?: string;
  site_id: string;
  daily_sequence_id: number;
  payment_type: string;
  cheque_number?: string;
  all_pay_transaction_id?: string;
  postal_order_number?: string;
  selected?: boolean;

  getReferenceId(): string {
    let referenceId = '';

    switch(this.payment_type) {
      case 'cheques':
      referenceId = `${this.cheque_number}`;
      break;

      case 'postal-orders':
      referenceId = `${this.postal_order_number}`;
      break;

      case 'allpay':
      referenceId = `${this.all_pay_transaction_id}`;
      break;

      default:
        referenceId = '-';
    }

    return referenceId;
  }
}
