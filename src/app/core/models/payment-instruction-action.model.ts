import { PaymentAction } from './paymentaction.model';
import { PaymentStatus } from './paymentstatus.model';

export class PaymentInstructionActionModel {
  action_reason: string;
  action_comment: string;
  status = PaymentStatus.VALIDATED;
  action = PaymentAction.SUSPENSE;
}
