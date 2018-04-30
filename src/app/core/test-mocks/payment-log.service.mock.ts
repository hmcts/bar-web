import {PaymentInstructionModel} from '../models/paymentinstruction.model';

export class PaymentLogServiceMock {
  getPaymentsLog(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return new Promise(resolve => resolve(paymentInstructionModels));
  }

  getPaymentById(feeId: number): PaymentInstructionModel {
    return new PaymentInstructionModel();
  }

  getUnallocatedAmount(feeId: number) {
    return new PaymentInstructionModel();
  }

  createCaseNumber(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return new Promise(resolve => resolve(paymentInstructionModels));
  }
}

