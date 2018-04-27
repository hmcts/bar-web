import {PaymentInstructionModel} from '../models/paymentinstruction.model';

export class PaymentLogServiceMock {
  getPaymentsLog(): Array<PaymentInstructionModel> {
    return [];
  }
}
