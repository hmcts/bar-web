import { PaymentAction } from './paymentaction.model';
import { PaymentStatus } from './paymentstatus.model';

export class PaymentInstructionActionModel {
  reason: string;
  comment: string;
  status = PaymentStatus.VALIDATED;
  action = PaymentAction.SUSPENSE;
}
