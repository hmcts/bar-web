export class PaymentInstructionModel {
  all_pay_transaction_id: string;
  amount: string;
  cheque_number: string;
  currency = 'GBP';
  payer_name: string;
  payment_type = 'cheque';
  postal_order_number: string;
}
