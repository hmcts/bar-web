import { IPaymentType } from '../interfaces/payment-types';

export class PaymentParent {
    id: number;
    payer_name: string;
    amount: string;
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

    get getReferenceId(): string {
        let referenceId = '-';

        switch (this.payment_type.id) {
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

        console.log( referenceId );

        return referenceId;
      }
}
