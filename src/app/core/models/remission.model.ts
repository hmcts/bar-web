import { IPaymentsLog, ICaseFeeDetail } from '../interfaces/payments-log';
import { PaymentAction } from './paymentaction.model';
import { IPaymentType } from '../interfaces';
import { PaymentStatus } from './paymentstatus.model';
import { PaymentTypeEnum } from './payment.type.enum';

export class RemissionModel implements IPaymentsLog {
  action?: PaymentAction;
  action_comment: string;
  action_reason: string;
  authorization_code?: string;
  all_pay_transaction_id?: string;
  case_fee_details?: ICaseFeeDetail[];
  cheque_number?: string;
  currency: string;
  daily_sequence_id: number;
  id: number;
  payer_name = '';
  payment_date: Date;
  payment_type: IPaymentType;
  payment_reference_id?: string;
  postal_order_number?: string;
  selected?: boolean;
  site_id: string;
  status: PaymentStatus;
  unallocated_amount?: number;
  remission_reference = '';

  getProperty(property: string) {
    throw new Error('Method not implemented.');
  }
  getPaymentReference(paymentTypeEnum: PaymentTypeEnum): string {
    throw new Error('Method not implemented.');
  }


}
