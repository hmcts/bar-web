import { PaymentParent } from './payment-parent.model';
import { IPaymentsLog } from '../interfaces/payments-log';
import { IPaymentType } from '../interfaces/payment-types';

export class PaymentInstructionModel extends PaymentParent implements IPaymentsLog {
    currency = 'GBP';
}
