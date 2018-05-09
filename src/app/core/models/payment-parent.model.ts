import { IPaymentType } from '../interfaces/payment-types';
import { ICaseReference } from '../interfaces/payments-log';
import { PaymentAction } from './paymentaction.model';
import { PaymentStatus } from './paymentstatus.model';

export class PaymentParent {
  action?: PaymentAction;
  id: number;
  payer_name: string;
  case_reference: string;
  case_references?: ICaseReference[];
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_date: Date;
  payment_reference?: string;
  site_id: string;
  authorization_code: string;
  daily_sequence_id: number;
  payment_type: any;
  cheque_number?: string;
  all_pay_transaction_id?: string;
  postal_order_number?: string;
  selected?: boolean;

  getProperty(property: string) {
    if (!this.hasOwnProperty(property)) {
      console.log(this);
      return '';
    }

    if (property === 'unallocated_amount') {
     return (this[property] / 100);
    }

    return this[property];
  }

  getPaymentReference () {
    let refId = '';
    if (this.payment_type.hasOwnProperty('name')) {
      switch (this.payment_type.id) {
        case 'cheques':
          refId = this.cheque_number;
          break;
        case 'postal-orders':
          refId = this.postal_order_number;
          break;
        case 'allpay':
          refId = this.all_pay_transaction_id;
          break;
        case 'cards':
          refId = this.authorization_code;
          break;
        default:
          refId = '';
      }
    }

    return refId;
  }
}
